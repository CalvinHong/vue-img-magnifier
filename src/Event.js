export default class {
    attach (evtName, element, listener, capture) {
        let evt         = '';
        const useCapture  = (capture === undefined) ? true : capture;
        let handler     = null;

        if (window.addEventListener === undefined) {
            evt = `on${evtName}`;
            handler = (evt, listener) => {
                element.attachEvent(evt, listener);
                return listener;
            };
        } else {
            evt = evtName;
            handler = (evt, listener, useCapture) => {
                element.addEventListener(evt, listener, useCapture);
                return listener;
            };
        }

        return handler.apply(element, [evt, ev => {
            const e   = ev || event;
            const src = e.srcElement || e.target;

            listener(e, src);
        }, useCapture]);
    }

    detach(evtName, element, listener, capture) {
        let evt         = '';
        const useCapture  = (capture === undefined) ? true : capture;

        if (window.removeEventListener === undefined) {
            evt = `on${evtName}`;
            element.detachEvent(evt, listener);
        } else {
            evt = evtName;
            element.removeEventListener(evt, listener, useCapture);
        }
    }

    stop(evt) {
        evt.cancelBubble = true;

        if (evt.stopPropagation) {
            evt.stopPropagation();
        }
    }

    prevent(evt){
        if (evt.preventDefault) {
            evt.preventDefault();
        } else {
            evt.returnValue = false;
        }
    }
};
