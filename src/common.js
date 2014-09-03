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
function DisableTouch(target){
    var noTouchLayer = new NoTouchLayer();
    target.addChild(noTouchLayer, 9);
    return noTouchLayer;
}
function EnableTouch(target, noTouchLayer){
    target.removeChild(noTouchLayer);
}
console.log("common load");
