/**
 *
 * Created by WG on 2014/8/31.
 */
var RemoveScene =  cc.Scene.extend({
    onEnter:function(){
        this._super();
        var removeLayer = new RemoveLayer();
        this.addChild(removeLayer);
    }
});
var RemoveLayer = cc.Layer.extend({
    ctor:function(){
        this._super();
        this.init();
    },
    bricks:[],
    row:6,
    column:6,
    brickTypes:[res.brick_yellow_png, res.brick_green_png, res.brick_red_png],
    initCandys:function(){
        this.bricks = [];
        var x_start = cc.winSize.width/2 - 2.5 * 34;
        var y_start = cc.winSize.height/2 - 2.5 * 34;
        for(var i = 0; i< this.row; i++){
            var line = [];
            for(var j = 0; j< this.column; j++){
                var brickIndex = Math.floor(Math.random()*this.brickTypes.length);
                var brickType = this.brickTypes[brickIndex];
                var brick = new cc.Sprite(brickType);
                brick.attr({ x:x_start+38*j, y:y_start+38*i });
                line.push({x:brick.x, y:brick.y, z:brickIndex});
                this.addChild(brick, 2);
            }
            this.bricks.push(line);
        }
        console.log(this.bricks);
    },
    onTouchesEnded:function(touches, event){
        console.log("touch end");
    },
    init:function(){
        var winSize = cc.winSize;
        var back = new cc.Sprite(res.brick_back_png);
        back.attr({ x:winSize.width/2, y:winSize.height/2 });
        this.addChild(back, 1);

        this.initCandys();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
    },
    onTouchEnded:function(){
        console.log("touch end");
    },
    onTouchBegan:function(){
        console.log("touch begin");
        return true;
    },
    onTouchMoved:function(touch){
        console.log("moved");
        var start = touch.getStartLocation();
        var end = touch.getLocation();
    }
});
