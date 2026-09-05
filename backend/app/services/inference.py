import tensorflow as tf
from tensorflow.keras import layers
from keras.models import load_model
import os
import numpy as np

from fastapi import UploadFile
from app.core.emotions import EMOTIONS
from app.utils.image_utils import preprocess_image

# Custom Attention Layer 
@tf.keras.utils.register_keras_serializable()
class AttentionLayer(layers.Layer):
    def __init__(self, **kwargs):
        super(AttentionLayer, self).__init__(**kwargs)
    
    def build(self, input_shape):
        self.W = self.add_weight(
            name='attention_weight',
            shape=(input_shape[-1], input_shape[-1]),
            initializer='glorot_uniform',
            trainable=True
        )
        self.b = self.add_weight(
            name='attention_bias',
            shape=(input_shape[-1],),
            initializer='zeros',
            trainable=True
        )
        super(AttentionLayer, self).build(input_shape)
    
    def call(self, x):
        e = tf.nn.tanh(tf.tensordot(x, self.W, axes=1) + self.b)
        a = tf.nn.softmax(e, axis=-1)
        return x * a
    
    def get_config(self):
        return super(AttentionLayer, self).get_config()


# Model Loading
MODEL_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "..",
    "models",
    "best_fer_model (3).h5"
)

print("Looking for model at:", MODEL_PATH)
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}")

_model = load_model(
    MODEL_PATH,
    custom_objects={"AttentionLayer": AttentionLayer},
    compile=False  
)
print("Emotion model loaded successfully")

# Prediction Function
async def predict_emotion(upload_file: UploadFile):
    try:
        image_bytes = await upload_file.read()
        img = preprocess_image(image_bytes)

        preds = _model.predict(img, verbose=0)
        preds = np.array(preds).reshape(-1)
        idx = int(np.argmax(preds))
        emotion = EMOTIONS[idx]
        confidence = float(preds[idx])

        return emotion, confidence
    except Exception as e:
        print("Prediction error:", e)
        raise RuntimeError(f"Emotion prediction failed: {e}") from e
