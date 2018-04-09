/**
 * @module Services
 */

export class HelperService {
    getParameterByName(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }

    async clearCache() {
        return (await caches.keys()).forEach(c => caches.delete(c));
    }

    closestByClass(el, selector) {
        while (el.className != selector) {
            el = el.parentNode;
            if (!el) {
                return null;
            }
        }

        return el;
    }

    closestByTag(el, selector) {
        while (el.tagName.toLowerCase() != selector.toLowerCase()) {
            el = el.parentNode;
            if (!el) {
                return null;
            }
        }

        return el;
    }

    addOnceEventListener(element, event, func, capture) {
        function callMeOnce(e) {
            func(e);
            element.removeEventListener(event, callMeOnce, capture);
        }
        element.addEventListener(event, callMeOnce, capture);
    }

    setByPath(obj, path, value) {
        var pList = path.split('.');
        var len = pList.length;
        for (var i = 0; i < len - 1; i++) {
            var elem = pList[i];
            if (!obj[elem]) obj[elem] = {}
            obj = obj[elem];
        }

        obj[pList[len - 1]] = value;
    }

    simulateClick(el) {
        var evt;
        if (document.createEvent) {
            evt = document.createEvent("MouseEvents");
            evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        (evt) ? el.dispatchEvent(evt) : (el.click && el.click());
    }

}