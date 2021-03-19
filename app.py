from flask import Flask, render_template, request
import os
from flask_cors import CORS
from PIL import Image
from predict import Predict
import json
app = Flask(__name__)
# app.config.from_object('satcounter_config')
CORS(app)
'''
이미지 처리 함수
'''
def image_resize(image, width, height):
    return image.resize((int(width), int(height)))

def image_rotate(image):
    return image.transpose(Image.ROTATE_180)

def image_change_bw(image):
    return image.convert('L')


'''
플라스크
'''

@app.route("/")
def index():
    return render_template('image.html')
@app.route('/data', methods=['POST'])

@app.route("/api/search/<query>")
def search_query(query=None):

   try:
      results,result2 = Predict(query)
      df_to_dict = results.to_json(orient='coloumns')
      data = json.dumps(df_to_dict, ensure_ascii=False, indent=4)
      return data

   except Exception as e:
      return (
         f"{e}"

   )
@app.route("/api/search/predict/<query>")
def search_querys(query=None):

   try:
      results,result2 = Predict(query)
      df_to_dict2 = result2.to_json(orient='coloumns')
      data2 = json.dumps(df_to_dict2)
      return (
         data2
      )

   except Exception as e:
      return (
         f"{e}"
   )

@app.route('/image_preprocess', methods=['POST'])
def preprocessing():
    if request.method == 'POST':
        file = request.files['uploaded_image']
        if not file: return render_template('index.html', label="No Files")

        img = Image.open(file)

        is_rotate_180 = request.form.get('pre_toggle_0')
        is_change_bw = request.form.get('pre_toggle_1')
        is_change_size = request.form.get('pre_toggle_2')

        if is_rotate_180 == 'on':
            img = image_rotate(img)

        if is_change_bw == 'on':
            img = image_change_bw(img)

        if is_change_size == 'on':
            img = image_resize(img, request.form.get('changed_width'), request.form.get('changed_height'))

        img.save('result_image.png')

        src_dir = os.path.dirname(os.path.abspath(__file__))
        image_path = os.path.join(src_dir, 'result_image.png')

        # 결과 리턴
        return render_template('image.html', label=image_path)


if __name__ == '__main__':
    app.run()