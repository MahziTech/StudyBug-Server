function jsonViewer(json, collapsible=false) {
    var TEMPLATES = {
        item: '<div class="json__item"><div class="json__key">%KEY%</div><div class="json__value json__value--%TYPE%">%VALUE%</div></div>',
        itemCollapsible: '<label class="json__item json__item--collapsible"><input type="checkbox" class="json__toggle"/><div class="json__key">%KEY%</div><div class="json__value json__value--type-%TYPE%">%VALUE%</div>%CHILDREN%</label>',
        itemCollapsibleOpen: '<label class="json__item json__item--collapsible"><input type="checkbox" checked class="json__toggle"/><div class="json__key">%KEY%</div><div class="json__value json__value--type-%TYPE%">%VALUE%</div>%CHILDREN%</label>'
    };

    function createItem(key, value, type){
        var element = TEMPLATES.item.replace('%KEY%', key);

        if(type == 'string') {
            element = element.replace('%VALUE%', '"' + value + '"');
        } else {
            element = element.replace('%VALUE%', value);
        }

        element = element.replace('%TYPE%', type);

        return element;
    }

    function createCollapsibleItem(key, value, type, children){
        var tpl = 'itemCollapsible';
        
        if(collapsible) {
            tpl = 'itemCollapsibleOpen';
        }
        
        var element = TEMPLATES[tpl].replace('%KEY%', key);

        element = element.replace('%VALUE%', type);
        element = element.replace('%TYPE%', type);
        element = element.replace('%CHILDREN%', children);

        return element;
    }

    function handleChildren(key, value, type) {
        var html = '';

        for(var item in value) { 
            var _key = item,
                _val = value[item];

            html += handleItem(_key, _val);
        }

        return createCollapsibleItem(key, value, type, html);
    }

    function handleItem(key, value) {
        var type = typeof value;

        if(Array.isArray(value)) {

            return handleChildren(key, value, "Array");
        }

        if(typeof value === 'object') {        
            return handleChildren(key, value, type);
        }

        return createItem(key, value, type);
    }

    function parseObject(obj) {
        _result = '<div class="json">';

        for(var item in obj) { 
            var key = item,
                value = obj[item];

            _result += handleItem(key, value);
        }

        _result += '</div>';

        return _result;
    }
    
    return parseObject(json);
};

function isJSONValid (jsonString){
    try {
        var o = JSON.parse(jsonString);
        console.log(o)
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }
    console.log("returning false")
    return false;
};

var json = {
    'User' : {
        'Personal Info': {
            'Name': 'Eddy',
            'Age': 3
        },
        'Active': true,
        'Messages': [
            'Message 1',
            'Message 2',
            'Message 3'
        ]
    },
    'Total': 1
}

var el = document.querySelector('.target');
el.innerHTML = jsonViewer(json, true);

let sendBtn = document.querySelector(".btn")
let bodyContent = document.querySelector("textarea")
let errorHTML = document.querySelector(".error")

bodyContent.addEventListener("input", e => {
    console.log(bodyContent.value)
    if(!isJSONValid(bodyContent.value)) {
        errorHTML.textContent = "ERROR: INVALID JSON"
        errorHTML.style.color = "red"
    } else {
        errorHTML.textContent = "JSON IS VALID"
        errorHTML.style.color = "green"
    }
})

sendBtn.addEventListener("click", () => {
    let bodyContentValue = document.querySelector("textarea").value
    let urlValue = document.getElementById("url").value
    el.innerHTML = jsonViewer(JSON.parse(bodyContentValue), true);
    console.log(urlValue, bodyContentValue)
})