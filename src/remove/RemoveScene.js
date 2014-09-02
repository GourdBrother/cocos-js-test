/**
 *
 * Created by WG on 2014/8/31.
 */
var RemoveScene =  cc.Scene.extend({
    bricks:null,
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
    onTouchesEnded:function(touches, event){
        console.log("touch end");
    },
    init:function(){
        var winSize = cc.winSize;
        var back = new cc.Sprite(res.brick_back_png);
        back.attr({ x:winSize.width/2, y:winSize.height/2 });
        this.addChild(back, 1);

        var bricks = new Bricks(6, 6, this);
        this.bricks = bricks;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
        }, this);
        var goBackLabel = new cc.LabelTTF("return", "Arial", 22);
        var retryLabel = new cc.LabelTTF("retry", "Arial", 22);
        var checkLabel = new cc.LabelTTF("check", "Arial", 22);
        var goBackLabelItem = new cc.MenuItemLabel(goBackLabel, AllMenuScene.onGameReturnAllMenu);
        var checkLabelItem = new cc.MenuItemLabel(checkLabel, this.bricks.CheckAllLoop, this.bricks);
        var retryLabelItem = new cc.MenuItemLabel(retryLabel ,this.onRetry, this);
        var backMenu = new cc.Menu(checkLabelItem, retryLabelItem, goBackLabelItem);
        this.addChild(backMenu, 2);
        backMenu.alignItemsVerticallyWithPadding(20);
        backMenu.attr({
            x: cc.winSize.width - 30,
            y: 60
        });
    },
    onRetry:function(){
        this.bricks.ReColorAll();
        this.bricks.CheckAllLoop();
    },
    onTouchEnded:function(touch, event){
        var location = touch.getLocation();
        var last_brick = event._currentTarget.bricks.PosToBrick(this.last_touch_begin);
        if(last_brick.x == -1 || last_brick.y == -1){
            console.log("from envalid");
            return ;
        }
        var now_brick = event._currentTarget.bricks.PosToBrick(location);
        if(now_brick.x == -1 || now_brick.y == -1){
            console.log("to envalid");
            return ;
        }
        if(Math.abs(now_brick.x - last_brick.x) + Math.abs(now_brick.y - last_brick.y) == 1){
            console.log("from ("+last_brick.x+","+last_brick.y+") to ("+now_brick.x+","+now_brick.y+")");
            event._currentTarget.bricks.Switch(last_brick, now_brick);
        }
    },
    last_touch_begin:null,
    onTouchBegan:function(touch){
        this.last_touch_begin = touch.getLocation();
        return true;
    },
    onTouchMoved:function(touch){
        //var brick_index = this.bricks.PosToBrick(start.x, start.y);
        //console.log(brick_index);
    }
});
