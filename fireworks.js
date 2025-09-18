// 烟花特效模块
class Fireworks {
    constructor() {
        this.container = document.getElementById('fireworks-container');
        this.isRunning = false;
        this.fireworks = [];
        this.maxFireworks = 15;
    }

    // 开始播放烟花特效
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.container.innerHTML = '';
        this.fireworks = [];
        
        // 连续发射烟花
        const launchInterval = setInterval(() => {
            if (this.fireworks.length < this.maxFireworks && this.isRunning) {
                this.createFirework();
            } else if (!this.isRunning) {
                clearInterval(launchInterval);
            }
        }, 300);
    }

    // 停止播放烟花特效
    stop() {
        this.isRunning = false;
        // 延迟清除以允许当前烟花完成动画
        setTimeout(() => {
            this.container.innerHTML = '';
            this.fireworks = [];
        }, 2000);
    }

    // 创建一个烟花
    createFirework() {
        const firework = document.createElement('div');
        firework.classList.add('firework');
        
        // 随机位置
        const left = Math.random() * 80 + 10; // 10% 到 90%
        firework.style.left = `${left}%`;
        firework.style.bottom = '0';
        
        // 随机颜色
        const colors = ['#ff6b6b', '#ff9a3c', '#ff6b9d', '#4ecdc4', '#6a5acd'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        firework.style.backgroundColor = color;
        
        // 随机大小
        const size = Math.random() * 4 + 2; // 2px 到 6px
        firework.style.width = `${size}px`;
        firework.style.height = `${size}px`;
        
        // 随机上升时间
        const riseDuration = Math.random() * 1 + 1; // 1s 到 2s
        
        // 设置样式
        firework.style.position = 'absolute';
        firework.style.borderRadius = '50%';
        firework.style.opacity = '1';
        firework.style.zIndex = '1000';
        firework.style.transition = `bottom ${riseDuration}s ease-out, opacity ${riseDuration}s ease-out`;
        
        this.container.appendChild(firework);
        this.fireworks.push(firework);
        
        // 触发上升动画
        setTimeout(() => {
            // 随机高度
            const height = Math.random() * 40 + 40; // 40% 到 80%
            firework.style.bottom = `${height}%`;
            firework.style.opacity = '0';
            
            // 上升到最高点后爆炸
            setTimeout(() => {
                if (firework.parentNode) {
                    this.explodeFirework(firework, color);
                }
            }, riseDuration * 1000);
        }, 10);
    }

    // 烟花爆炸效果
    explodeFirework(firework, color) {
        // 移除原始烟花
        if (firework.parentNode) {
            firework.parentNode.removeChild(firework);
        }
        
        // 创建爆炸粒子
        const particleCount = Math.floor(Math.random() * 20) + 30; // 30 到 50 个粒子
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('firework-particle');
            
            // 设置粒子位置为爆炸中心
            particle.style.left = firework.style.left;
            particle.style.bottom = firework.style.bottom;
            
            // 设置粒子颜色
            particle.style.backgroundColor = color;
            
            // 随机粒子大小
            const size = Math.random() * 3 + 1; // 1px 到 4px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // 设置样式
            particle.style.position = 'absolute';
            particle.style.borderRadius = '50%';
            particle.style.opacity = '1';
            particle.style.zIndex = '1000';
            
            this.container.appendChild(particle);
            particles.push(particle);
            
            // 随机粒子方向和距离
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 150 + 50; // 50px 到 200px
            
            // 计算终点位置
            const startBottom = parseInt(firework.style.bottom);
            const endBottom = startBottom + Math.sin(angle) * distance / 3;
            const startLeft = parseInt(firework.style.left);
            const endLeft = startLeft + Math.cos(angle) * distance / 3;
            
            // 随机动画持续时间
            const duration = Math.random() * 1.5 + 1.5; // 1.5s 到 3s
            
            // 设置过渡效果
            particle.style.transition = `all ${duration}s ease-out`;
            
            // 触发粒子动画
            setTimeout(() => {
                particle.style.bottom = `${endBottom}%`;
                particle.style.left = `${endLeft}%`;
                particle.style.opacity = '0';
                
                // 动画结束后移除粒子
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, duration * 1000);
            }, 10);
        }
    }
}

// 初始化烟花特效并挂载到window对象上
window.fireworks = new Fireworks();