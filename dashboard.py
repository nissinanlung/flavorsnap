import panel as pn
import torch
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
import io
import os
import sys
from pathlib import Path

# Add src to Python path for imports
sys.path.insert(0, str(Path(__file__).parent / 'src'))

from src.ui.preprocessing_controls import PreprocessingControls
from src.ui.confidence_chart import create_confidence_chart
from src.core.image_enhancer import ImageEnhancer
from src.core.classifier import FlavorSnapClassifier

# Configure Panel extensions with custom CSS and JS
pn.extension('css', js_files={
    'charts': ['static/js/charts.js']
}, css_files={
    'charts': ['static/css/charts.css']
})

# Load model using the enhanced classifier
classifier = FlavorSnapClassifier()
model = classifier.model
class_names = classifier.class_names

# Transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# Save image to correct folder
def save_image(image_obj, predicted_class, image_name="uploaded_image.jpg"):
    save_dir = f"data/train/{predicted_class}"
    os.makedirs(save_dir, exist_ok=True)
    image_path = os.path.join(save_dir, image_name)
    image_obj.save(image_path)

# Panel UI
image_input = pn.widgets.FileInput(accept='image/*')
output = pn.pane.Markdown("Upload an image of food 🍲")
image_preview = pn.pane.Image(width=300, height=300, visible=False)
processed_preview = pn.pane.Image(width=300, height=300, visible=False)
spinner = pn.indicators.LoadingSpinner(value=False, width=50)

# Create confidence chart component
confidence_chart = create_confidence_chart(animate=True)
confidence_chart_component = confidence_chart.create_layout()

# Preprocessing controls
preprocessing_controls = PreprocessingControls()
preprocessing_panel = preprocessing_controls.create_layout()

# Global variables
original_image = None
processed_image = None

def on_image_update(image):
    """Handle image updates from preprocessing controls."""
    global processed_image
    processed_image = image
    if image:
        processed_preview.object = image
        processed_preview.visible = True

def handle_image_upload():
    """Handle image upload and initialize preprocessing."""
    global original_image, processed_image
    
    if image_input.value is None:
        return
    
    try:
        # Load the image
        original_image = Image.open(io.BytesIO(image_input.value)).convert('RGB')
        processed_image = original_image.copy()
        
        # Update previews
        image_preview.object = original_image
        image_preview.visible = True
        processed_preview.object = processed_image
        processed_preview.visible = True
        
        # Load image into preprocessing controls
        preprocessing_controls.load_image(original_image)
        preprocessing_controls.on_image_update = on_image_update
        
        output.object = "📸 Image loaded! Use preprocessing controls to enhance, then classify."
        
    except Exception as e:
        output.object = f"❌ Error loading image: {str(e)}"

def classify(event=None):
    global original_image, processed_image
    
    if image_input.value is None:
        output.object = "⚠️ Please upload an image first."
        image_preview.visible = False
        processed_preview.visible = False
        return
    
    if processed_image is None:
        output.object = "⚠️ Please wait for image to load or apply preprocessing."
        return
    
    try:
        # Start spinner
        spinner.value = True
        output.object = "🔍 Classifying..."

        # Use processed image for classification
        image_to_classify = processed_image

        # Get preprocessing parameters
        preprocessing_params = preprocessing_controls.get_enhancement_params()

        # Use enhanced classifier for detailed results
        result = classifier.classify_image(image_to_classify, preprocessing_params)
        
        # Extract results
        predicted_class = result['predicted_class']
        confidence_score = result['confidence']
        all_probabilities = result['all_probabilities']
        
        # Update confidence chart with all probabilities
        confidence_chart.update_predictions(all_probabilities, predicted_class)

        # Save processed image
        save_image(image_to_classify, predicted_class)
        
        # Create enhanced result message
        confidence_percentage = confidence_score * 100
        entropy = result['metadata']['entropy']
        avg_confidence = result['metadata']['average_confidence']
        
        result_message = f"""
✅ **Classification Result: {predicted_class}**

### 🎯 Confidence Scores
- **Top Prediction:** {predicted_class} ({confidence_percentage:.1f}%)
- **Model Uncertainty (Entropy):** {entropy:.3f}
- **Average Confidence:** {avg_confidence:.1f}%

### 📊 Preprocessing Parameters Applied:
- **Brightness**: {preprocessing_params['brightness']:.1f}
- **Contrast**: {preprocessing_params['contrast']:.1f}
- **Rotation**: {preprocessing_params['rotation']:.0f}°
- **Aspect Ratio**: {preprocessing_params.get('aspect_ratio', 'Original')}
- **Crop**: {preprocessing_params.get('crop_box', 'None')}

💾 Processed image saved to training data!

📈 **View the confidence chart below** to see probabilities for all food classes.
        """
        
        output.object = result_message
        
    except Exception as e:
        output.object = f"❌ Error: {str(e)}"
        # Reset chart on error
        confidence_chart.reset()
    finally:
        spinner.value = False

run_button = pn.widgets.Button(name='Classify', button_type='primary')
run_button.on_click(classify)

# Setup image upload handler
image_input.param.watch(lambda event: handle_image_upload(), 'value')

# Create layout with preprocessing controls
upload_section = pn.Column(
    "## 📤 Upload Image",
    image_input,
    pn.layout.Divider(),
)

preview_section = pn.Column(
    "## 🖼️ Image Preview",
    pn.Row(
        pn.Column("### Original", image_preview),
        pn.Column("### Processed", processed_preview),
    ),
)

controls_section = pn.Column(
    "## 🎨 Preprocessing Controls",
    preprocessing_panel,
)

classification_section = pn.Column(
    "## 🍽️ Classification",
    pn.Row(run_button, spinner),
    output,
)

confidence_section = pn.Column(
    "## 📈 Confidence Analysis",
    confidence_chart_component,
)

app = pn.Row(
    pn.Column(
        upload_section,
        preview_section,
        classification_section,
        confidence_section,
        sizing_mode='stretch_width',
        max_width=800,
    ),
    controls_section,
    sizing_mode='stretch_width',
)

app = pn.Row(
    pn.Column(
        upload_section,
        preview_section,
        classification_section,
        sizing_mode='stretch_width',
        max_width=600,
    ),
    controls_section,
    sizing_mode='stretch_width',
)

app.servable()
