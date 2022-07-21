(()=>{
    var a=(n)=>document.createElement(n);
    var _=(n,i)=>{var o=a(n);o.id=i;return o}
    var b = (i)=>_("div",i);
    var c=b("prompt-wrapper");
    var d=b("prompt");
    var e=b("prompt-header");
    var f=b("prompt-body");
    var g=b("prompt-inputs");
    var h=b("prompt-button-row");
    var i=a("style");
    c.append(d,i);
    d.append(e,f,g,h);
    i.innerHTML = `#prompt-wrapper {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        align-items: center;
        background: #0004;
        display: none;
        z-index: 2;
    }
    #prompt {
        min-width: 50vw;
        min-height: 20vh;
        margin: auto;
        background: #ddd;
        border-radius: 20px;
        padding: 20px;
        position: relative;
    }
    #prompt-header {
        font-size: 2em;
        border-bottom: 2px solid #bbb;
    }
    #prompt-button-row {
        margin-top: 10px;
    }
    .prompt-button {
        font-size: 1.5em;
        border: none;
        background: #eee;
        border-radius: 20px;
        min-width: 50px;
        margin-left: 10px;
        padding: 7px;
        cursor: pointer;
        transition-duration: 0.2s;
    }
    .prompt-button:hover {
        background: #fff;
    }
    #prompt-inputs {
        display: inline-block;
        margin-top: 10px;
    }
    .prompt-input {
        border: 2px solid #bbb;
        border-radius: 20px;
        background: #ddd;
        margin-left: 10px;
        padding: 7px;
        outline: none;
    }`;
    document.body.append(c);
})();

function customPrompt(title, body, buttons, inputs) {
    function $(e) {
        return document.querySelector(e);
    }
    $("#prompt-header").innerHTML = title;
    $("#prompt-body").innerHTML = body;
    $("#prompt-button-row").innerHTML = "";
    $("#prompt-inputs").innerHTML = "";
    var res;
    var promise = new Promise(function(r){res = r});
    if (buttons) {
        buttons.forEach(function(value) {
            var e = document.createElement("button");
            e.classList.add("prompt-button");
            e.append(value.text);
            e.addEventListener("click", function() {
                value.function(function(info) {
                    res(info);
                    $("#prompt-wrapper").style.display = "none";
                }, (function() {
                    var list = [];
                    Array.from($("#prompt-inputs").children).forEach(function(item) {
                        list.push(item.value);
                    });
                    return list;
                })());
            });
            $("#prompt-button-row").append(e);
        });
    }
    if (inputs) {
        inputs.forEach(function(value) {
            var e = document.createElement("input");
            e.classList.add("prompt-input");
            e.placeholder = value.name;
            $("#prompt-inputs").append(e);
        });
    }
    $("#prompt-wrapper").style.display = "flex";
    return promise;
}