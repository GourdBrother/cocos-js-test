/**
 * logic for bricks
 * Created by WG on 2014/8/31.
 */
var Brick = cc.Sprite.extend({
    colorType:null,
    row:null,
    column:null,
    remove:false,
    colorCount:6,
    ctor:function( row, column){
        this._super();
        this.row = row;
        this.column = column;
        this.colorType = this.ReColor({color:undefined, time:0});
    },

    /**
     *
     * @param args{color,time}
     * @returns {*}
     * @constructor
     */
    ReColor:function(args) {
        var color = args.color;
        var time = args.time;
        var png_name;
        //not give the color, random it
        if(color === undefined){
           color = Math.floor(Math.random()*this.colorCount)+1;
        }
        switch(color){
            case 0:
                png_name = res.brick_null_png;
                break;
            case 1:
                png_name = res.brick_yellow_png;
                break;
            case 2:
                png_name = res.brick_red_png;
                break;
            case 3:
                png_name = res.brick_green_png;
                break;
            case 4:
                png_name = res.brick_blue_png;
                break;
            case 5:
                png_name = res.brick_orange_png;
                break;
            case 6:
                png_name = res.brick_pink_png;
                break;
            default:
                color = 0;
                png_name = res.brick_null_png;
                break;
        }
        if(time > 0) {
            this.runAction(new cc.FadeTo(time, 0));
        }
        this.setTexture(png_name);
        if(time> 0) {
            this.runAction(new cc.FadeTo(time, 255));
        }
        this.remove = false;
        return color;
    }
});
var Bricks = cc.Class.extend({
    row_num:null,
    column_num:null,
    brick_size:34,
    brick_gap:38,
    bricks:[],
    center_x:null,
    center_y:null,
    start_x:null,
    start_y:null,
    ctor:function(row, column, layer){
        this.row_num = row;
        this.column_num = column;
        this.bricks = [];
        this.center_x = cc.winSize.width/2;
        this.center_y = cc.winSize.height/2;
        this.start_x =  this.center_x - (this.column_num/2-0.5) * this.brick_gap;
        this.start_y =  this.center_y - (this.row_num/2-0.5) * this.brick_gap;
        for(var i = 0; i< this.row_num;i++ ){
           var line = [];
           for(var j= 0; j< this.column_num; j++){
               var brick = new Brick(i, j);
               layer.addChild(brick, 2);
               brick.attr({x:this.start_x+ j*this.brick_gap,y:this.start_y+i*this.brick_gap});
               line.push(brick);
           }
           this.bricks.push(line);
        }
    },
    PosToBrick:function(pos){
        var x= pos.x;
        var y= pos.y;
        var x_index = (x + 0.5*this.brick_gap - this.start_x)/this.brick_gap;
        var y_index = (y + 0.5*this.brick_gap - this.start_y)/this.brick_gap;

        if(x_index < 0 || x_index >= this.column_num){
            x_index = -1;
        }
        if(y_index < 0 || y_index >= this.column_num){
            y_index = -1;
        }
        return {x:Math.floor(x_index) , y:Math.floor(y_index)};
    },
    Switch:function(pos1, pos2) {
        var brick1 = this.bricks[pos1.y][pos1.x];
        var brick2 = this.bricks[pos2.y][pos2.x];
        var texture1 = brick1.getTexture();
        var texture2 = brick2.getTexture();
        brick1.setTexture(texture2);
        brick2.setTexture(texture1);
    },
    CheckAllLoop:function(){
        while(this.CheckAll() > 0){
        }
    },
    CheckAll:function(){
        var removeCount = 0;
        for(var i = 0; i< this.row_num; i++){
            var sameNum = 0;
            var lastColor = -1;
            for(var j = 0; j< this.column_num; j++){
                var thisColor = this.bricks[i][j].colorType;
                if(j == 0){
                    sameNum +=1;
                    lastColor = thisColor;
                }else if (thisColor === lastColor){
                    sameNum ++;
                }else{
                   if(sameNum >= 3) {
                       for (var k = 0; k < sameNum; k++) {
                           //this.bricks[i][j-1-k].setTexture(res.brick_null_png);
                           this.bricks[i][j-1-k].remove = true;
                       }
                   }
                   lastColor = thisColor;
                   sameNum = 1;
                }
            }
            if(sameNum >=3){
                for (var k = 0; k < sameNum; k++) {
                    //this.bricks[i][this.column_num-1-k].setTexture(res.brick_null_png);
                    this.bricks[i][j-1-k].remove = true;
                }
            }
        }
        for(var i = 0; i< this.column_num; i++){
            var sameNum = 0;
            var lastColor = -1;
            for(var j = 0; j< this.row_num; j++){
                var thisColor = this.bricks[j][i].colorType;
                if(j == 0){
                    sameNum +=1;
                    lastColor = thisColor;
                }else if (thisColor === lastColor){
                    sameNum ++;
                }else{
                    if(sameNum >= 3) {
                        for (var k = 0; k < sameNum; k++) {
                            //this.bricks[i][j-1-k].setTexture(res.brick_null_png);
                            this.bricks[j-1-k][i].remove = true;
                        }
                    }
                    lastColor = thisColor;
                    sameNum = 1;
                }
            }
            if(sameNum >=3){
                for (var k = 0; k < sameNum; k++) {
                    //this.bricks[i][this.column_num-1-k].setTexture(res.brick_null_png);
                    this.bricks[j-1-k][i].remove = true;
                }
            }
        }
        for(var i = 0; i< this.row_num; i++){
            for(var j = 0; j< this.column_num; j++) {
                if(this.bricks[i][j].remove == true){
                    console.log(this.bricks[i][j].ReColor({color:undefined, time:0.5}));
                    removeCount ++;
                }
            }
        }
        return removeCount;
    },
    CheckPos:function(pos1){
    },
    ReColorAll:function(){
        for(var i = 0; i< this.row_num; i++) {
            for (var j = 0; j < this.column_num; j++) {
                this.bricks[i][j].ReColor({color:undefined , time:0});
            }
        }
    }
});
