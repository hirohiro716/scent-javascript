/**
 * Scentライブラリ.
 * 
 * @author hiro
 * @version 1.0.0
 */

// jQueryの読み込み
if (typeof $ === "undefined") {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js";
    document.getElementsByTagName('head')[0].appendChild(script);
}

/**
 * windowの読み込みが完了した際に実行する.
 * 
 * @param {function} onloadFunction
 */
$scent = function(onloadFunction) {
    window.onload = function() {
        onloadFunction();
    }
}

/**
 * 位置情報を取得する.
 * 
 * @param {function} successFunction(coords) 成功時のコールバック(第一引数に位置情報が入る)
 * @param {function} errorFunction(error) 失敗時のコールバック(第一引数にエラー情報が入る)
 */
$scent.geolocation = function(successFunction, errorFunction) {
    if (navigator.geolocation === undefined) {
        throw "Your device is not supported of geolocation.";
    }
    var innerSuccessFunction = function(position) {
        position.coords.parent = position;
        successFunction(position.coords);
    };
    navigator.geolocation.getCurrentPosition(innerSuccessFunction, errorFunction, {enableHighAccuracy: true, timeout: 30000});
}

/**
 * AjaxでPOST送信して結果を処理する.
 * 
 * @param {Object} values 送信する連想配列オブジェクト
 * @param {string} url 送信先URL
 * @param {function} successFunction(result) 成功時のコールバック(第一引数に送信先から返却された情報が入る)
 * @param {function} errorFunction(XMLHttpRequest, textStatus, errorThrown) 失敗時のコールバック(引数は$.ajaxのエラーコールバックに準ずる)
 */
$scent.post = function(values, url, successFunction, errorFunction) {
    $.ajax({
        type: 'post',
        url: url,
        dataType: 'json',
        data: values,
        success: function(result) {
            successFunction(result);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            errorFunction(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

/**
 * Ajaxでformのinputをすべてaction属性のURLに対してPOST送信して結果を処理する.
 * 
 * @param {Element} form 送信するform要素またはjQueryオブジェクト
 * @param {function} successFunction(result) 成功時のコールバック(第一引数に送信先から返却された情報が入る)
 * @param {function} errorFunction(XMLHttpRequest, textStatus, errorThrown) 失敗時のコールバック(引数は$.ajaxのエラーコールバックに準ずる)
 */
$scent.postForm = function(form, successFunction, errorFunction) {
    var values = $(form).serializeArray();
    var url = $(form).attr('action');
    $scent.post(values, url, successFunction, errorFunction);
}

/**
 * すべてのinputに対して値をセットする.
 * 
 * @param {Object} values {inputの名前:値}の連想配列
 */
$scent.setValues(values) {
    $.each(values, function(name, value) {
        $scent.setValue($('[name="' + name + '"]'), value);
    }
}

/**
 * inputに対して値をセットする.
 * 
 * @param {Element} inputElement セットする対象のinput
 * @param {string} value 値
 */
$scent.setValue(inputElement, value) {
    switch ($(inputElement).attr('type')) {
    case 'checkbox':
    case 'radio':
        $(inputElement).val([value]);
        break;
    default:
        $(inputElement).val(value);
        break;
    }
}