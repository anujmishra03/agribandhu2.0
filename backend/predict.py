import os
import sys
import json
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

# Exact transform from final_model.ipynb (Cell 3 & 6)
val_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

def load_classes(classes_path):
    with open(classes_path, 'r') as f:
        return json.load(f)

def load_model(model_dir, num_classes):
    traced_path = os.path.join(model_dir, "plant_disease_model_traced.pt")
    pth_path = os.path.join(model_dir, "plant_disease_mobilenetv3.pth")

    # Load traced model if available
    if os.path.exists(traced_path):
        try:
            model = torch.jit.load(traced_path, map_location=device)
            model.eval()
            return model
        except Exception as e:
            sys.stderr.write(f"Traced model load error: {e}, falling back to state_dict\n")

    # Fallback to exact model setup from final_model.ipynb (Cell 4)
    model = models.mobilenet_v3_small(weights=None)
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, num_classes)
    state_dict = torch.load(pth_path, map_location=device)
    model.load_state_dict(state_dict)
    model = model.to(device)
    model.eval()
    return model

# Exact diagnose_leaf logic from final_model.ipynb (Cell 6)
def diagnose_leaf(image_path, model, class_names, min_confidence=50.0):
    model.eval()
    raw_img = Image.open(image_path).convert("RGB")
    tensor = val_transform(raw_img).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(tensor)
        probs = torch.nn.functional.softmax(outputs, dim=1)
        top_probs, top_indices = torch.topk(probs, 3, dim=1)

    top_prob = top_probs[0][0].item() * 100.0
    top_label = class_names[top_indices[0][0].item()].replace("___", " - ").replace("_", " ")

    candidates = []
    for i in range(3):
        idx = top_indices[0][i].item()
        p = top_probs[0][i].item() * 100.0
        lbl = class_names[idx].replace("___", " - ").replace("_", " ")
        raw_cls = class_names[idx]
        candidates.append({"label": lbl, "raw_class": raw_cls, "confidence": round(p, 2)})

    is_low_conf = top_prob < min_confidence
    raw_class = class_names[top_indices[0][0].item()]

    result = {
        "prediction": top_label,
        "raw_class": raw_class,
        "confidence": round(top_prob, 2),
        "is_low_confidence": is_low_conf,
        "candidates": candidates
    }
    return result

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)

    image_path = sys.argv[1]
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_dir = os.path.join(base_dir, "model")
    classes_path = os.path.join(model_dir, "classes.json")

    if not os.path.exists(image_path):
        print(json.dumps({"error": f"Image file not found: {image_path}"}))
        sys.exit(1)

    if not os.path.exists(classes_path):
        print(json.dumps({"error": f"Classes file not found: {classes_path}"}))
        sys.exit(1)

    class_names = load_classes(classes_path)
    model = load_model(model_dir, len(class_names))
    res = diagnose_leaf(image_path, model, class_names)
    print(json.dumps(res))
