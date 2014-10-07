/**
 *
 * Created by WG on 2014/8/30.
 */
function make_center(target){
    target.attr({
        x:cc.winSize.width/2,
        y:cc.winSize.height/2
    })
};
var NoTouchLayer = cc.Layer.extend({
    ctor:function(){
        this._super();
        this.init();
    },
    init:function(){
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
    },
    onTouchBegan:function(){
        return true;
    },
    onTouchMoved:function(){
    },
    onTouchEnded:function(){
    }
});

// new notouchlayer, and make it layer's attr,so need't new again when addChild after remove
function DisableTouchInit(layer){
    var noTouchLayer = new NoTouchLayer();
    layer._noTouchLayer = noTouchLayer;
    cc.log("disable touch layer init");
}
function DisableTouch(layer){
    layer.addChild(layer._noTouchLayer, 9);
    cc.log("disable touch");
}
function EnableTouch(layer){
    layer.removeChild(layer._noTouchLayer);
    cc.log("enable touch");
}
