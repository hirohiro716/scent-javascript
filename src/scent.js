/**
 * Scentライブラリ。
 * 
 * @author hiro
 * @version 1.0.0
 */

if (typeof $ === "undefined") {
    throw "jQuery is not defined";
}

/**
 * windowの読み込みが完了した際に実行する。
 * 
 * @param {function} onloadFunction
 */
$scent = function(onloadFunction) {
    $(window).on("load", function() {
        onloadFunction();
    });
}

/**
 * windowの幅にCSSプロパティを同期する。
 */
$scent.bindWindowWidth = function(element, cssProperty) {
    let process = function() {
        $(element).css(cssProperty, $(window).width());
    }
    process();
    $(window).on("resize", process);
}

/**
 * windowの高さにCSSプロパティを同期する。
 */
$scent.bindWindowHeight = function(element, cssProperty) {
    let process = function() {
        $(element).css(cssProperty, $(window).height());
    }
    process();
    $(window).on("resize", process);
}

/**
 * windowの幅と高さを比較して大きい方に画像サイズを合わせる。
 */
$scent.adjustBackgroundImage = function(element, url) {
    $(element).css("background-image", "url('" + url + "')");
    $(element).css("background-repeat", "no-repeat");
    let process = function() {
        if ($(window).width() > $(window).height()) {
            $(element).css("background-size", "100% auto");
        } else {
            $(element).css("background-size", "auto 100%");
        }
    }
    process();
    $(window).on("resize", process);
}

/**
 * 位置情報を取得する。
 * 
 * @param {function} successFunction(coords) 成功時のコールバック(第一引数に位置情報が入る)
 * @param {function} errorFunction(error) 失敗時のコールバック(第一引数にエラー情報が入る)
 */
$scent.geolocation = function(successFunction, errorFunction) {
    if (navigator.geolocation === undefined) {
        throw "Your device is not supported of geolocation.";
    }
    let innerSuccessFunction = function(position) {
        position.coords.parent = position;
        successFunction(position.coords);
    }
    navigator.geolocation.getCurrentPosition(innerSuccessFunction, errorFunction, {enableHighAccuracy: true, timeout: 30000});
}

/**
 * AjaxでPOST送信して結果を処理する。
 * 
 * @param {Object} values 送信する連想配列オブジェクト
 * @param {string} url 送信先URL
 * @param {function} successFunction(result) 成功時のコールバック(第一引数に送信先から返却された情報が入る)
 * @param {function} errorFunction(XMLHttpRequest, textStatus, errorThrown) 失敗時のコールバック(引数は$.ajaxのエラーコールバックに準ずる)
 */
$scent.post = function(values, url, successFunction, errorFunction) {
    $.ajax({
        type: "post",
        url: url,
        dataType: "json",
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
 * Ajaxでformのinputをすべてaction属性のURLに対してPOST送信して結果を処理する。
 * 
 * @param {Element} form 送信するform要素またはjQueryオブジェクト
 * @param {function} successFunction(result) 成功時のコールバック(第一引数に送信先から返却された情報が入る)
 * @param {function} errorFunction(XMLHttpRequest, textStatus, errorThrown) 失敗時のコールバック(引数は$.ajaxのエラーコールバックに準ずる)
 */
$scent.postForm = function(form, successFunction, errorFunction) {
    let values = $(form).serializeArray();
    let url = $(form).attr("action");
    $scent.post(values, url, successFunction, errorFunction);
}

/**
 * すべてのinputに対して値をセットする。
 * 
 * @param {Object} values {inputの名前:値}の連想配列
 */
$scent.setValues = function(values) {
    $.each(values, function(name, value) {
        $scent.setValue($("[name='" + name + "']"), value);
    });
}

/**
 * inputに対して値をセットする。
 * 
 * @param {Element} inputElement セットする対象のinput
 * @param {string} value 値
 */
$scent.setValue = function(inputElement, value) {
    switch ($(inputElement).attr("type")) {
    case "checkbox":
    case "radio":
        $(inputElement).val([value]);
        break;
    default:
        $(inputElement).val(value);
    break;
    }
}

/**
 * すべてのinputのタイトルに対してエラーメッセージと赤枠をセットする。
 * 
 * @param {Object} errorMessages {inputの名前:エラーメッセージ}の連想配列
 */
$scent.setErrors = function(errorMessages) {
    $.each(errorMessages, function(name, errorMessage) {
        $scent.setError($("[name='" + name + "']"), errorMessage);
    });
}

/**
 * inputタイトルに対してエラーメッセージと赤枠をセットする。
 * 
 * @param {Element} inputElement セットする対象のinput
 * @param {string} errorMessage エラーメッセージ
 */
$scent.setError = function(inputElement, errorMessage) {
    switch ($(inputElement).attr("type")) {
    case "checkbox":
    case "radio":
        break;
    default:
        $(inputElement).attr("title", errorMessage);
        $(inputElement).css("box-shadow", "0 0 2px 1px crimson")
        break;
    }
}

/**
 * ロングタップのイベントを追加する。
 * 
 * @param {string} selector 追加する対象を選ぶためのセレクタ
 * @param {integer} fireMillisecond 処理が実行されるまでの時間(ミリ秒)
 * @param {function} onloadFunction 処理内容
 */
$scent.setLongtapEventListener = function(selector, fireMillisecond, onLongtapFunction) {
    let timeout;
    $(document).on("touchstart", selector, function(event) {
        sourceElement = $(this);
        timeout = window.setTimeout(function() {
            window.clearTimeout(timeout);
            onLongtapFunction(sourceElement);
            event.preventDefault();
            event.stopImmediatePropagation();
        }, fireMillisecond);
    });
    $(document).on("touchend", selector, function(event) {
        window.clearTimeout(timeout);
    });
    $(document).on("touchmove", selector, function(event) {
        window.clearTimeout(timeout);
    });
    $(document).on("contextmenu", selector, function(event) {
        return false;
    });
}

/**
 * ページ内ジャンプのaに対してぬるぬるスクロールを有効にする。
 * 
 * @param {Element} aElement 有効にする対象のa
 * @param {integer} duration アニメーションの時間の長さ(ミリ秒)
 */
$scent.enableSmoothScroll = function(aElement, duration) {
    $(aElement).click(function() {
        if (this.hash !== undefined && this.hash.slice(0, 1) == '#') {
            let anchor = this.hash.slice(1);
            let target = $('#' + anchor);
            if (target === undefined) {
                target = $('[name=' + anchor + ']');
            }
            if (target !== undefined) {
                $('html, body').animate({scrollTop: target.offset().top}, {duration: duration});
                return false;
            }
        }
    });
}
