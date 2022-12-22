import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WinUI')
export class WinUI extends Component {

    callback
    start() {

    }
    setUp(callback){
        this.callback = callback;
    }
    update(deltaTime: number) {
        
    }

    onClickNextLevel(){
        this.node.destroy();
        this.callback();
    }
}


