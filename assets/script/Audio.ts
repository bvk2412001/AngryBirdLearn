import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Audio')
export class Audio extends Component {
    public static instance :Audio | null = null;

    @property(AudioClip)
    private gameAudios:AudioClip[] = [];

    @property(AudioSource)
    private audioSource:AudioSource;
    start() {
        if(Audio.instance == null){
            Audio.instance = this;
        }
    }

    update(deltaTime: number) {
        
    }

    playSound(index : number) {
        this.audioSource?.playOneShot(this.gameAudios[index], 1.0);
    }
}


