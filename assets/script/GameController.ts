import { _decorator, Camera, Component, ERigidBody2DType, EventTouch, Graphics, Input, input, instantiate, Node, Prefab, resources, RigidBody2D, Vec2, Vec3 } from 'cc';
import { LevelController } from './LevelController';
import { WinUI } from './WinUI';
import { Audio } from './Audio';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    private gameLevel: number = 1;
    private currentLevelNode: Node | null = null;
    private bird: Node | null = null;
    private birdPrefab: Prefab | null = null;
    @property(Node)
    private ui_draw: Node | null = null;
    private graphic: Graphics | null = null;
    @property(Camera)
    private camera: Camera | null = null;
    private birdPosition: Vec3 | null = new Vec3(-450, -100, 0);
    //target.x = -450+640, target.y = -100+360

    @property(Node)
    private first_node: Node | null;
    private firstPoint: Vec3;
    private pullVector: Vec3 | null = null;
    //
    private winUIPrefab: Prefab | null = null;
    start() {
        this.firstPoint = new Vec3(this.first_node.position.x, this.first_node.position.y, 0,)
        this.graphic = this.ui_draw.getComponent(Graphics);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.setUpLevel();
    }

    private onTouchStart() {

    }

    private onTouchMove(event: EventTouch) {
        this.graphic.clear();

        //tao diem bat dau 
        this.graphic.moveTo(this.firstPoint.x, this.firstPoint.y);

        //Hàm chuyển vị trí camera sang vị trí thật 
        let lastPoint = this.camera.screenToWorld(new Vec3(event.getLocation().x, event.getLocation().y, 0))
        //diem cuoi
        this.graphic.lineTo(lastPoint.x, lastPoint.y)
        this.graphic.stroke();

        this.pullVector = lastPoint.subtract(this.firstPoint);
    }

    private onTouchEnd() {
        this.graphic.clear();
        if (this.pullVector && this.bird) {
            let birdRiggid: RigidBody2D = this.bird.getChildByName('birdSprite').getComponent(RigidBody2D);
            birdRiggid.type = ERigidBody2DType.Dynamic;
            setTimeout(() => {
                Audio.instance.playSound(1);
                birdRiggid.applyForce(new Vec2(this.pullVector.x, this.pullVector.y).multiply(new Vec2(-20, -20)), Vec2.ZERO, true);
            }, 100)

        }
    }

    update(deltaTime: number) {

    }

    private setUpLevel() {
        let pathLevel = "gameLevel/level1";
        this.loadPrefab(pathLevel, (prefab: Prefab) => {
            this.currentLevelNode = instantiate(prefab);
            this.currentLevelNode.getComponent(LevelController).setUp(() => {
                setTimeout(() => {
                    this.showUIWin();
                }, 1000)
            })
            this.node.addChild(this.currentLevelNode);
        })

        const createBird = (pre: Prefab) => {
            this.bird = instantiate(pre);
            this.bird.setPosition(this.birdPosition);
            this.node.addChild(this.bird);
        }

        if (this.birdPrefab == null) {
            let pathBird = "bird/bird";
            this.loadPrefab(pathBird, (prefab: Prefab) => {
                this.birdPrefab = prefab;
                createBird(prefab);
            })
        }
        else {
            createBird(this.birdPrefab);
        }

    }

    private loadPrefab(path: string, callBack: CallableFunction) {
        resources.load(path, (error, prefab: Prefab) => {
            if (callBack) {
                callBack(prefab);
            }
        })
    }

    private showUIWin() {
        Audio.instance.playSound(0);
        const createUiWin = (prefab: Prefab) => {
            let winUI = instantiate(prefab);
            winUI.getComponent(WinUI).setUp(() => {
                this.nexLevel();
            })
            this.node.addChild(winUI);
        }
        if (this.winUIPrefab == null) {
            this.loadPrefab('ui/winUI', (prefab: Prefab) => {
                this.winUIPrefab = prefab;
                createUiWin(prefab);
            })
        } else {
            createUiWin(this.winUIPrefab);
        }
    }


    private nexLevel() {
        this.currentLevelNode.destroy();
        this.currentLevelNode = null;
        this.bird.destroy();
        this.gameLevel++;   
        setTimeout(() => {
            this.setUpLevel();
        }, 1000)
    }
}


