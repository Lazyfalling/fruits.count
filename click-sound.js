// 点击音效管理器 - 增强版
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.isSoundEnabled = true;
        this.init();
    }

    init() {
        try {
            // 尝试创建AudioContext
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('音频上下文初始化成功');
        } catch (error) {
            console.warn('浏览器不支持Web Audio API，音效功能将不可用');
            this.isSoundEnabled = false;
        }
    }

    // 通用音效播放方法
    playSound(frequency, duration, type = 'sine', volume = 0.3, frequencyRamp = null) {
        if (!this.isSoundEnabled || !this.audioContext) {
            return;
        }

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            // 设置振荡器类型
            oscillator.type = type;
            
            // 设置基础频率
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            
            // 频率变化（如果有）
            if (frequencyRamp) {
                oscillator.frequency.exponentialRampToValueAtTime(
                    frequencyRamp.target, 
                    this.audioContext.currentTime + frequencyRamp.duration
                );
            }

            // 设置音量包络
            gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

            // 连接节点
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // 播放声音
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);

        } catch (error) {
            console.warn('播放音效时出错:', error);
        }
    }

    // 清脆的点击音效
    playClickSound() {
        this.playSound(1000, 0.08, 'sine', 0.25, {
            target: 600,
            duration: 0.06
        });
    }

    // 愉悦的选择确认音效
    playSelectSound() {
        this.playSound(1500, 0.15, 'triangle', 0.35, {
            target: 800,
            duration: 0.12
        });
    }

    // 新增：水果选择成功音效
    playFruitSelectSound() {
        this.playSound(1200, 0.18, 'sawtooth', 0.4, {
            target: 900,
            duration: 0.15
        });
    }

    // 新增：错误提示音效
    playErrorSound() {
        this.playSound(300, 0.1, 'square', 0.2, {
            target: 200,
            duration: 0.08
        });
    }

    // 新增：游戏开始音效
    playGameStartSound() {
        this.playSound(800, 0.25, 'sine', 0.5, {
            target: 1200,
            duration: 0.2
        });
    }

    // 新增：排列完成音效
    playArrangeSound() {
        // 短促的上升音效
        this.playSound(600, 0.12, 'sine', 0.3, {
            target: 1000,
            duration: 0.1
        });
    }

    // 新增：胜利庆祝音效
    playSuccessSound() {
        // 欢快的胜利音效序列
        this.playSound(800, 0.15, 'sine', 0.4, {
            target: 1200,
            duration: 0.12
        });
        
        setTimeout(() => {
            this.playSound(1000, 0.15, 'sine', 0.4, {
                target: 1500,
                duration: 0.12
            });
        }, 150);
        
        setTimeout(() => {
            this.playSound(1200, 0.2, 'sine', 0.5, {
                target: 800,
                duration: 0.18
            });
        }, 300);
    }
    
    // 新增：失败提示音效
    playFailSound() {
        // 低沉的失败音效
        this.playSound(400, 0.2, 'square', 0.3, {
            target: 200,
            duration: 0.18
        });
    }

    toggleSound() {
        this.isSoundEnabled = !this.isSoundEnabled;
        console.log('音效', this.isSoundEnabled ? '开启' : '关闭');
        return this.isSoundEnabled;
    }
}

// 创建全局音效管理器
window.soundManager = new SoundManager();