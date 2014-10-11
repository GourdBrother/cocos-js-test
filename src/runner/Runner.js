/**
 * Created by wg on 14-10-12.
 */
var RunnerLayer = cc.Layer.extend({
    runner:null,
    ctor: function () {
        this._super();
        this.init();
    },
    init: function () {
        this.runner = new cc.Sprite(res.runner_png);
        var winSize = cc.winSize;
        var runnerSize = this.runner.getContentSize();
        this.runner.attr({
           anchorX:0,
           anchorY:0,
           //x:runnerSize.width/2,
           //y:runnerSize.height/2
            x:0,
            y:0
        });
        this.addChild(this.runner, 1);
    }
});
var RunnerScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new RunnerLayer();
        this.addChild(layer);
    }
});