import { _decorator, Collider, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, RigidBody2D } from 'cc';
import { LevelController } from './LevelController';
const { ccclass, property } = _decorator;

@ccclass('PigController')
export class PigController extends Component {
    start() {
        let collect = this.getComponent(Collider2D);
        if(collect){
            collect.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){
        if(this.node){
            if(otherCollider.node.name=="ground" || otherCollider.node.name.includes("bird")){
                let level = this.node.getParent();
                level.getComponent(LevelController).pigDie();
            }
        }
    }

    
    update(deltaTime: number) {
        
    }
}


