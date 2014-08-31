/**
 *
 * Created by WG on 2014/8/26.
 */
var flareEffect = function (flare, target, callback ) {
    console.log("flare");
    flare.stopAllActions();
    flare.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
    flare.attr({
        x: 130,
        y: 297,
        visible: true,
        opacity: 255,
        rotation: -120,
        scale: 0.2
    });
    var opacityAnim = cc.fadeTo(0.5, 255);
    var opacDim = cc.fadeTo(1, 0);
    var biggerEase = cc.scaleBy(3, 3).easing(cc.easeExponentialInOut());
    var easeMove = cc.moveBy(0.5, cc.p(328, 0)).easing(cc.easeSineOut());
    var rotateEase = cc.rotateBy(2.5, 90).easing(cc.easeExponentialOut());
    var bigger = cc.scaleTo(0.5, 1);
    var onComplete = cc.callFunc(callback, target);
    var killflare = cc.callFunc(function(){
        this.parent.removeChild(this, true);
        console.log("kill");
    }, flare);
    flare.runAction(cc.sequence(  opacityAnim, biggerEase));
    console.log("flare");
    /*flare.runAction(easeMove);
    flare.runAction(rotateEase);
    flare.runAction(bigger);
    */

}

