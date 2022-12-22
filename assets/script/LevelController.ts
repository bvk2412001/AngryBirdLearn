import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelController')
export class LevelController extends Component {

    callback;
    start() {

    }


    setUp(callback){
        this.callback = callback;
    }
    update(deltaTime: number) {
        
    }

    public pigDie(){
        this.callback();
    }
}


