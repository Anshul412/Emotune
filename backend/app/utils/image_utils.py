import cv2
import numpy as np
import os

IMG_SIZE = 72

# Keep the detector inside the project so Windows OpenCV installs do not depend
# on cv2.data/haarcascades being present.
CASCADE_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "..",
    "models",
    "haarcascade_frontalface_default.xml",
)

_face_cascade = cv2.CascadeClassifier(CASCADE_PATH)
if _face_cascade.empty():
    raise RuntimeError(f"Face detector not found or invalid: {CASCADE_PATH}")


def preprocess_image(contents: bytes):
    np_img = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_GRAYSCALE)

    if img is None:
        raise ValueError("Invalid image")

    # Detect the face before resizing. The FER model was trained on facial crops.
    faces = _face_cascade.detectMultiScale(
        img,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(40, 40),
    )

    if len(faces):
        # Pick the largest face and add a small margin.
        x, y, w, h = max(faces, key=lambda f: f[2] * f[3])
        margin = int(0.15 * max(w, h))
        x1 = max(0, x - margin)
        y1 = max(0, y - margin)
        x2 = min(img.shape[1], x + w + margin)
        y2 = min(img.shape[0], y + h + margin)
        img = img[y1:y2, x1:x2]

    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE), interpolation=cv2.INTER_AREA)
    img = img.astype("float32") / 255.0
    img = np.expand_dims(img, axis=-1)
    img = np.expand_dims(img, axis=0)

    return img
