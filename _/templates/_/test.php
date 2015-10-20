<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
	<title>Test</title>
</head>
<body>
				<form id="redactorInsertImageForm" class="_-forms--wysiwyg--edit--img" method="post" action="/admin/save?img" enctype="multipart/form-data">
					<div id="redactor_tab1" class="redactor_tab">
						<input type="file" id="redactor_file" name="file" /> <input type="submit" name="_submit" value=">" />
						<div class="_-forms--wysiwyg--edit--img--align">
							<h3>Align Image</h3>
							<label><input type="radio" class="input--radio" name="img[align]" value="l" /> Left</label>
							<label><input type="radio" class="input--radio" name="img[align]" value="c" /> Center</label>
							<label><input type="radio" class="input--radio" name="img[align]" value="r" /> Right</label>
						</div>
						<div class="_-forms--wysiwyg--edit--img--size">
							<h3>Image Size</h3>
							<label><input type="text" class="input--text short" name="img[w]" value="" /> Width (px)</label>
							<label><input type="text" class="input--text short" name="img[h]" value="" /> Height (px)</label>
						</div>
					</div>
					<div id="redactor_tab2" class="redactor_tab" style="display: none;">
						<div id="redactor_image_box"></div>
					</div>
				</form>
</body>
</html>