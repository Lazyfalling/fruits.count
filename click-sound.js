// 音效管理模块
class SoundManager {
    constructor() {
        // 创建音频元素
        this.sounds = {
            click: this.createAudio('冒泡.mp3'),
            fruitSelect: this.createAudio('冒泡.mp3'),
            error: this.createAudio('错误.mp3'),
            success: this.createAudio('通关.mp3'),
            fail: this.createAudio('失败.mp3'),
            gameStart: this.createAudio('冒泡.mp3'),
            arrange: this.createAudio('冒泡.mp3')
        };
    }

    // 创建音频元素
    createAudio(src) {
        const audio = new Audio(src);
        audio.volume = 0.5; // 设置音量为50%
        return audio;
    }

    // 播放点击音效
    playClickSound() {
        this.playSound(this.sounds.click);
    }

    // 播放水果选择音效
    playFruitSelectSound() {
        this.playSound(this.sounds.fruitSelect);
    }

    // 播放错误音效
    playErrorSound() {
        this.playSound(this.sounds.error);
    }

    // 播放成功音效
    playSuccessSound() {
        this.playSound(this.sounds.success);
    }

    // 播放失败音效
    playFailSound() {
        this.playSound(this.sounds.fail);
    }

    // 播放游戏开始音效
    playGameStartSound() {
        this.playSound(this.sounds.gameStart);
    }

    // 播放排列音效
    playArrangeSound() {
        this.playSound(this.sounds.arrange);
    }

    // 通用播放方法
    playSound(sound) {
        // 克隆音频元素以允许多次快速播放
        const soundClone = sound.cloneNode();
        soundClone.play().catch(error => {
            console.log('音频播放失败:', error);
        });
    }
}

// 初始化音效管理器并挂载到window对象上
window.soundManager = new SoundManager();