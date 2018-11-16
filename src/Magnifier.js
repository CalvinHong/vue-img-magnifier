export default function (evt, options) {
    const gOptions = options || {};
    let curThumb = null;
    let curData = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        lensW: 0,
        lensH: 0,
        lensBgX: 0,
        lensBgY: 0,
        largeW: 0,
        largeH: 0,
        largeL: 0,
        largeT: 0,
        zoom: 2,
        zoomMin: 1.1,
        zoomMax: 5,
        mode: 'outside',
        largeWrapperId: (gOptions.largeWrapper !== undefined)
            ? (gOptions.largeWrapper.id || null)
            : null,
        status: 0,
        zoomAttached: false,
        zoomable: (gOptions.zoomable !== undefined)
            ? gOptions.zoomable
            : false,
        onthumbenter: (gOptions.onthumbenter !== undefined)
            ? gOptions.onthumbenter
            : null,
        onthumbmove: (gOptions.onthumbmove !== undefined)
            ? gOptions.onthumbmove
            : null,
        onthumbleave: (gOptions.onthumbleave !== undefined)
            ? gOptions.onthumbleave
            : null,
        onzoom: (gOptions.onzoom !== undefined)
            ? gOptions.onzoom
            : null
    };

    const pos = {
        t: 0,
        l: 0,
        x: 0,
        y: 0
    };

    let gId = 0;
    let status = 0;
    let curIdx = '';
    let curLens = null;
    let curLarge = null;

    const gZoom = (gOptions.zoom !== undefined)
                ? gOptions.zoom
                : curData.zoom;

    const gZoomMin = (gOptions.zoomMin !== undefined)
                ? gOptions.zoomMin
                : curData.zoomMin;

    const gZoomMax = (gOptions.zoomMax !== undefined)
                ? gOptions.zoomMax
                : curData.zoomMax;

    const gMode = gOptions.mode || curData.mode;
    const data = {};
    let inBounds = false;
    let isOverThumb = 0;

    const getElementsByClass = className => {
        let list = [];
        let elements = null;
        let len = 0;
        let pattern = '';
        let i = 0;
        let j = 0;

        if (document.getElementsByClassName) {
            list = document.getElementsByClassName(className);
        } else {
            elements = document.getElementsByTagName('*');
            len = elements.length;
            pattern = new RegExp(`(^|\\s)${className}(\\s|$)`);

            for (i, j; i < len; i += 1) {
                if (pattern.test(elements[i].className)) {
                    list[j] = elements[i];
                    j += 1;
                }
            }
        }

        return list;
    };

    const $ = selector => {
        let idx = '';
        const type = selector.charAt(0);
        let result = null;

        if (type === '#' || type === '.') {
            idx = selector.substr(1, selector.length);
        }

        if (idx !== '') {
            switch (type) {
            case '#':
                result = document.getElementById(idx);
                break;
            case '.':
                result = getElementsByClass(idx);
                break;
            }
        }

        return result;
    };

    const createLens = (thumb, idx) => {
        const lens = document.createElement('div');

        lens.id = `${idx}-lens`;
        lens.className = 'magnifier-loader';

        thumb.parentNode.appendChild(lens);
    };

    const updateLensOnZoom = () => {
        curLens.style.left = `${pos.l+1}px`;
        curLens.style.top = `${pos.t+1}px`;
        curLens.style.width = `${curData.lensW}px`;
        curLens.style.height = `${curData.lensH}px`;
        curLens.style.backgroundPosition = `-${curData.lensBgX}px -${curData.lensBgY}px`;

        curLarge.style.left = `-${curData.largeL}px`;
        curLarge.style.top = `-${curData.largeT}px`;
        curLarge.style.width = `${curData.largeW}px`;
        curLarge.style.height = `${curData.largeH}px`;
    };

    const updateLensOnLoad = (idx, thumb, large, largeWrapper) => {
        const lens = $(`#${idx}-lens`);
        let textWrapper = null;
        if (data[idx].status === 1) {
            textWrapper = document.createElement('div');
            textWrapper.className = 'magnifier-loader-text';
            lens.className = 'magnifier-loader magnifier-hidden';

            textWrapper.appendChild(document.createTextNode('Loading...'));
            lens.appendChild(textWrapper);
        } else if (data[idx].status === 2) {
            const {width, height} = thumb.getBoundingClientRect()
            lens.className = 'magnifier-lens magnifier-hidden';
            lens.childNodes.length && lens.removeChild(lens.childNodes[0]);
            lens.style.background = `url(${thumb.src}) no-repeat 0 0 scroll`;
            lens.style.backgroundSize = `${width}px ${height}px`
            large.id = `${idx}-large`;
            large.style.width = `${data[idx].largeW}px`;
            large.style.height = `${data[idx].largeH}px`;
            large.className = 'magnifier-large magnifier-hidden';
            
            if (data[idx].mode === 'inside') {
                lens.appendChild(large);
            } else {
                largeWrapper.appendChild(large);
            }
        }

        lens.style.width = `${data[idx].lensW}px`;
        lens.style.height = `${data[idx].lensH}px`;
    };

    const getMousePos = () => {
        const xPos = pos.x - curData.x;
        const yPos = pos.y - curData.y;
        let t    = 0;
        let l    = 0;

        inBounds = (
            xPos < 0 ||
            yPos < 0 ||
            xPos > curData.w ||
            yPos > curData.h
        )
            ? false
            : true;
        l = xPos - (curData.lensW / 2);
        t = yPos - (curData.lensH / 2);

        if (curData.mode !== 'inside') {
            if (xPos < curData.lensW / 2) {
                l = 0;
            }

            if (yPos < curData.lensH / 2) {
                t = 0;
            }
            // console.log(xPos, curData.w , curData.lensW / 2)
            // if (xPos - curData.w + (curData.lensW / 2) > 0) {
            //     l = curData.w - (curData.lensW + 2);
            // }
            // console.log(l, curData.w - curData.lensW)
            l = Math.min(l, curData.w - curData.lensW)

            // if (yPos - curData.h + (curData.lensH / 2) > 0) {
            //     t = curData.h - (curData.lensH + 2);
            // }
            t = Math.min(t, curData.h - curData.lensH)
        }
        // console.log(curData.offsetLeft)
        pos.l = Math.round(l);
        pos.t = Math.round(t);

        curData.lensBgX = pos.l + 1;
        curData.lensBgY = pos.t + 1;

        if (curData.mode === 'inside') {
            curData.largeL = Math.round(xPos * (curData.zoom - (curData.lensW / curData.w)));
            curData.largeT = Math.round(yPos * (curData.zoom - (curData.lensH / curData.h)));
        } else {
            curData.largeL = Math.round(curData.lensBgX * curData.zoom * (curData.largeWrapperW / curData.w));
            curData.largeT = Math.round(curData.lensBgY * curData.zoom * (curData.largeWrapperH / curData.h));
        }
    };

    const zoomInOut = e => {
        const delta = (e.wheelDelta > 0 || e.detail < 0) ? 0.1 : -0.1;
        const handler = curData.onzoom;
        let multiplier = 1;
        let w = 0;
        let h = 0;

        if (e.preventDefault) {
            e.preventDefault();
        }

        e.returnValue = false;

        curData.zoom = Math.round((curData.zoom + delta) * 10) / 10;

        if (curData.zoom >= curData.zoomMax) {
            curData.zoom = curData.zoomMax;
        } else if (curData.zoom >= curData.zoomMin) {
            curData.lensW = Math.round(curData.w / curData.zoom);
            curData.lensH = Math.round(curData.h / curData.zoom);

            if (curData.mode === 'inside') {
                w = curData.w;
                h = curData.h;
            } else {
                w = curData.largeWrapperW;
                h = curData.largeWrapperH;
                multiplier = curData.largeWrapperW / curData.w;
            }

            curData.largeW = Math.round(curData.zoom * w);
            curData.largeH = Math.round(curData.zoom * h);

            getMousePos();
            updateLensOnZoom();

            if (handler !== null) {
                handler({
                    thumb: curThumb,
                    lens: curLens,
                    large: curLarge,
                    x: pos.x,
                    y: pos.y,
                    zoom: Math.round(curData.zoom * multiplier * 10) / 10,
                    w: curData.lensW,
                    h: curData.lensH
                });
            }
        } else {
            curData.zoom = curData.zoomMin;
        }
    };

    const onThumbEnter = () => {
        curData = data[curIdx];
        curLens = $(`#${curIdx}-lens`);

        if (curData.status === 2) {
            curLens.className = 'magnifier-lens';
            curLens.style.pointerEvents = 'none';
            if (curData.zoomAttached === false) {
                if (curData.zoomable !== undefined && curData.zoomable === true) {
                    evt.attach('mousewheel', curLens, zoomInOut);

                    if (window.addEventListener) {
                        curLens.addEventListener('DOMMouseScroll', e => {
                            zoomInOut(e);
                        });
                    }
                }

                curData.zoomAttached = true;
            }

            curLarge = $(`#${curIdx}-large`);
            curLarge.className = 'magnifier-large';
        } else if (curData.status === 1) {
            curLens.className = 'magnifier-loader';
        }
    };

    const onThumbLeave = () => {
        if (curData.status > 0) {
            const handler = curData.onthumbleave;

            if (handler !== null) {
                handler({
                    thumb: curThumb,
                    lens: curLens,
                    large: curLarge,
                    x: pos.x,
                    y: pos.y
                });
            }

            if (!curLens.className.includes('magnifier-hidden')) {
                curLens.className += ' magnifier-hidden';
                curThumb.className = curData.thumbCssClass;

                if (curLarge !== null) {
                    curLarge.className += ' magnifier-hidden';
                }
            }
        }
    };

    const move = () => {
        if (status !== curData.status) {
            onThumbEnter();
        }

        if (curData.status > 0) {
            curThumb.className = `${curData.thumbCssClass} magnifier-opaque`;

            if (curData.status === 1) {
                curLens.className = 'magnifier-loader';
            } else if (curData.status === 2) {
                curLens.className = 'magnifier-lens';
                curLarge.className = 'magnifier-large';
                curLarge.style.left = `-${curData.largeL}px`;
                curLarge.style.top = `-${curData.largeT}px`;
            }

            curLens.style.left = `${pos.l+1+curData.offsetLeft}px`;
            curLens.style.top = `${pos.t+1+curData.offsetTop}px`;
            curLens.style.backgroundPosition = `-${curData.lensBgX}px -${curData.lensBgY}px`;

            const handler = curData.onthumbmove;

            if (handler !== null) {
                handler({
                    thumb: curThumb,
                    lens: curLens,
                    large: curLarge,
                    x: pos.x,
                    y: pos.y
                });
            }
        }

        status = curData.status;
    };

    const setThumbData = (thumb, thumbData) => {
        const thumbBounds = thumb.getBoundingClientRect();
        const largeWrapperBounds = $('#'+thumbData.largeWrapperId).getBoundingClientRect();
        let w = 0;
        let h = 0;

        thumbData.x = thumbBounds.left;
        thumbData.y = thumbBounds.top;
        thumbData.w = thumbBounds.width;
        thumbData.h = thumbBounds.height;
        // thumbData.w = Math.round(thumbBounds.right - thumbData.x);
        // thumbData.h = Math.round(thumbBounds.bottom - thumbData.y);
        thumbData.largeWrapperW = largeWrapperBounds.width;
        thumbData.largeWrapperH = largeWrapperBounds.height;
        // console.log(thumb.offsetLeft)
        thumbData.offsetLeft = thumb.offsetLeft
        thumbData.offsetTop = thumb.offsetTop

        thumbData.lensW = Math.round(thumbData.w / thumbData.zoom);
        thumbData.lensH = Math.round(thumbData.h / thumbData.zoom);

        if (thumbData.mode === 'inside') {
            w = thumbData.w;
            h = thumbData.h;
        } else {
            w = thumbData.largeWrapperW;
            h = thumbData.largeWrapperH;
        }

        thumbData.largeW = Math.round(thumbData.zoom * w);
        thumbData.largeH = Math.round(thumbData.zoom * h);
    };

    this.attach = function (options) {
        if (options.thumb === undefined) {
            throw {
                name: 'Magnifier error',
                message: 'Please set thumbnail',
                toString() {return `${this.name}: ${this.message}`; }
            };
        }

        const thumb = $(options.thumb);
        let i = 0;

        if (thumb.length !== undefined) {
            for (i; i < thumb.length; i += 1) {
                options.thumb = thumb[i];
                this.set(options);
            }
        } else {
            options.thumb = thumb;
            this.set(options);
        }
    };

    this.setThumb = thumb => {
        curThumb = thumb;
    };

    this.set = options => {
        if (data[options.thumb.id] !== undefined) {
            curThumb = options.thumb;
            return false;
        }

        const thumbObj    = new Image();
        const largeObj    = new Image();
        const thumb       = options.thumb;
        let idx         = thumb.id;
        let zoomable    = null;
        let largeUrl    = null;

        const largeWrapper = (
            $(`#${options.largeWrapper}`) ||
            $(`#${thumb.getAttribute('data-large-img-wrapper')}`) ||
            $(`#${curData.largeWrapperId}`)
        );

        curData.largeWrapper = largeWrapper

        const zoom = options.zoom || thumb.getAttribute('data-zoom') || gZoom;
        const zoomMin = options.zoomMin || thumb.getAttribute('data-zoom-min') || gZoomMin;
        const zoomMax = options.zoomMax || thumb.getAttribute('data-zoom-max') || gZoomMax;
        const mode = options.mode || thumb.getAttribute('data-mode') || gMode;

        const onthumbenter = (options.onthumbenter !== undefined)
                    ? options.onthumbenter
                    : curData.onthumbenter;

        const onthumbleave = (options.onthumbleave !== undefined)
                    ? options.onthumbleave
                    : curData.onthumbleave;

        const onthumbmove = (options.onthumbmove !== undefined)
                    ? options.onthumbmove
                    : curData.onthumbmove;

        const onzoom = (options.onzoom !== undefined)
                    ? options.onzoom
                    : curData.onzoom;

        if (options.large === undefined) {
            largeUrl = (options.thumb.getAttribute('data-large-img-url') !== null)
                            ? options.thumb.getAttribute('data-large-img-url')
                            : options.thumb.src;
        } else {
            largeUrl = options.large;
        }

        if (largeWrapper === null && mode !== 'inside') {
            throw {
                name: 'Magnifier error',
                message: 'Please specify large image wrapper DOM element',
                toString() {return `${this.name}: ${this.message}`; }
            };
        }

        if (options.zoomable !== undefined) {
            zoomable = options.zoomable;
        } else if (thumb.getAttribute('data-zoomable') !== null) {
            zoomable = (thumb.getAttribute('data-zoomable') === 'true');
        } else if (curData.zoomable !== undefined) {
            zoomable = curData.zoomable;
        }

        if (thumb.id === '') {
            idx = thumb.id = `magnifier-item-${gId}`;
            gId += 1;
        }

        createLens(thumb, idx);

        data[idx] = {
            zoom,
            zoomMin,
            zoomMax,
            mode,
            zoomable,
            thumbCssClass: thumb.className,
            zoomAttached: false,
            status: 0,
            largeUrl,
            largeWrapperId: mode === 'outside' ? largeWrapper.id : null,
            largeWrapperW: mode === 'outside' ? largeWrapper.offsetWidth : null,
            largeWrapperH: mode === 'outside' ? largeWrapper.offsetHeight : null,
            onzoom,
            onthumbenter,
            onthumbleave,
            onthumbmove
        };

        evt.attach('mouseover', thumb.parentNode, (e) => 
        {
            // const src = thumb
            // console.log('mouseenter')
            if (curData.status !== 0) {
                onThumbLeave();
            }

            curIdx = idx;
            curThumb = thumb;

            onThumbEnter(curThumb);

            setThumbData(curThumb, curData);

            pos.x = e.clientX;
            pos.y = e.clientY;

            getMousePos();
            move();

            const handler = curData.onthumbenter;

            if (handler !== null) {
                handler({
                    thumb: curThumb,
                    lens: curLens,
                    large: curLarge,
                    x: pos.x,
                    y: pos.y
                });
            }
        }, true);
        evt.attach('mousemove', thumb.parentNode, () => {
            isOverThumb = 1;
        }, true);

        evt.attach('mouseout', thumb.parentNode, () => {
            // console.log('mouseleave')
            isOverThumb = 0;
            onThumbLeave();
        }, true)

        evt.attach('load', thumbObj, () => {
            data[idx].status = 1;

            setThumbData(thumb, data[idx]);
            updateLensOnLoad(idx);

            evt.attach('load', largeObj, () => {
                data[idx].status = 2;
                updateLensOnLoad(idx, thumb, largeObj, largeWrapper);
            });

            largeObj.src = data[idx].largeUrl;
        });

        thumbObj.src = thumb.src;
        evt.attach('load', thumb, () => {
            if(thumb.src !== thumbObj.src) {
                thumbObj.src = thumb.src
                if (options.large === undefined) {
                    largeUrl = (thumb.getAttribute('data-large-img-url') !== null)
                                    ? thumb.getAttribute('data-large-img-url')
                                    : thumb.src;
                } else {
                    largeUrl = options.large;
                }
                data[idx].largeUrl = largeUrl
            }
        })
        this.handleResize = ()=>{
            setThumbData(thumb, data[idx]);
            updateLensOnLoad(idx, thumb, largeObj, largeWrapper);
        }
    };
    const bindDocumentMouseMove = e => {
        requestAnimationFrame(()=>{
            if(!isOverThumb) return;
            pos.x = e.clientX;
            pos.y = e.clientY;
    
            getMousePos();
    
            if (inBounds === true) {
                move();
            }
        })
    }
    evt.attach('mousemove', document, bindDocumentMouseMove, false);

    this.destory = ()=>{
        evt.detach('mousemove', document, bindDocumentMouseMove)
        evt.detach('resize', window, bindWindowResize);
        evt.detach('scroll', window, bindWindowScroll);
    }

    const bindWindowResize = () => {
        requestAnimationFrame(()=>{
            this.handleResize && this.handleResize()
        })
    }

    evt.attach('resize', window, bindWindowResize);

    const bindWindowScroll = () => {
        requestAnimationFrame(()=>{
            if (curThumb !== null) {
                setThumbData(curThumb, curData);
            }
        })
    }
    evt.attach('scroll', window, bindWindowScroll);
};
