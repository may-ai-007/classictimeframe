// 真实快门音效 (媒体文件)
const SHUTTER_SOUND = 'media/polaroid-camera.mp3';
const EXPORT_SIZE = 600;

// 相框模板库（参考文档6.1节）
const frameTemplates = {
    classic: {
        name: 'classic',
        nameKey: 'frameClassic',
        padding: {top: 12, right: 12, bottom: 48, left: 12},
        background: '#FFFFFF',
        shadow: '0 4px 16px rgba(0,0,0,0.15)',
        font: 'cursive',
        textColor: '#333',
        description: '最经典的拍立得风格，纯白干净'
    },
    vintage: {
        name: 'vintage',
        nameKey: 'frameVintage',
        padding: {top: 16, right: 16, bottom: 56, left: 16},
        background: 'linear-gradient(180deg, #FFF8DC 0%, #F5E6D3 100%)',
        shadow: '0 6px 20px rgba(139, 115, 85, 0.3)',
        font: 'serif',
        textColor: '#5C4A3A',
        description: '1970-80年代复古感，泛黄质感'
    },
    modern: {
        name: 'modern',
        nameKey: 'frameModern',
        padding: {top: 8, right: 8, bottom: 40, left: 8},
        background: '#1A1A1A',
        shadow: '0 8px 32px rgba(0,0,0,0.6)',
        font: 'monospace',
        textColor: '#FFFFFF',
        description: '前卫黑白风格，高级感十足'
    },
    pastel: {
        name: 'pastel',
        nameKey: 'framePastel',
        padding: {top: 14, right: 14, bottom: 50, left: 14},
        background: 'linear-gradient(135deg, #FFE5E5 0%, #FFF5F5 100%)',
        shadow: '0 4px 12px rgba(255, 182, 193, 0.4)',
        font: 'cursive',
        textColor: '#FF69B4',
        description: '少女心爆棚，温柔优雅'
    },
    ocean: {
        name: 'ocean',
        nameKey: 'frameOcean',
        padding: {top: 12, right: 12, bottom: 48, left: 12},
        background: 'linear-gradient(135deg, #B0E0E6 0%, #87CEEB 100%)',
        shadow: '0 4px 16px rgba(70, 130, 180, 0.3)',
        font: 'cursive',
        textColor: '#1E90FF',
        description: '清爽蓝调，夏日必备'
    },
    party: {
        name: 'party',
        nameKey: 'frameParty',
        padding: {top: 12, right: 12, bottom: 48, left: 12},
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)',
        shadow: '0 4px 16px rgba(255, 107, 107, 0.4)',
        font: 'cursive',
        textColor: '#FFFFFF',
        description: '派对氛围，活力四射'
    },
    forest: {
        name: 'forest',
        nameKey: 'frameForest',
        padding: {top: 12, right: 12, bottom: 48, left: 12},
        background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
        shadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
        font: 'serif',
        textColor: '#FFFFFF',
        description: '森林系，自然清新'
    }
};

// 主题拍照模式
const photoThemes = {
    party: {
        name: 'party',
        nameKey: 'themeParty',
        frame: 'party',
        filter: 'rainbow',
        description: '派对模式，适合庆祝场合'
    },
    retro: {
        name: 'retro',
        nameKey: 'themeRetro',
        frame: 'vintage',
        filter: 'vintage',
        description: '复古模式，怀旧风格'
    },
    nature: {
        name: 'nature',
        nameKey: 'themeNature',
        frame: 'forest',
        filter: 'forest',
        description: '自然模式，户外拍摄'
    },
    minimal: {
        name: 'minimal',
        nameKey: 'themeMinimal',
        frame: 'modern',
        filter: 'blackwhite',
        description: '极简模式，黑白风格'
    },
    dreamy: {
        name: 'dreamy',
        nameKey: 'themeDreamy',
        frame: 'pastel',
        filter: 'ocean',
        description: '梦幻模式，柔和色调'
    }
};

// 配置
const FILTERS = [
    {c:'#ddd', f:'', n:'original'}, {c:'#222', f:'grayscale(1)', n:'blackwhite'}, 
    {c:'#ff5e57', f:'sepia(0.5) hue-rotate(-30deg)', n:'red'}, 
    {c:'#ffa502', f:'sepia(0.8) hue-rotate(-10deg)', n:'sunset'},
    {c:'#eccc68', f:'sepia(0.6)', n:'vintage'}, 
    {c:'#7bed9f', f:'hue-rotate(80deg)', n:'forest'},
    {c:'#70a1ff', f:'hue-rotate(180deg)', n:'ocean'}, 
    {c:'#a55eea', f:'hue-rotate(240deg)', n:'violet'},
    {c:'linear-gradient(45deg,red,blue)', f:'', n:'rainbow', rainbow:true}
];
const ERAS = [
    {y:'1982', f:'sepia(0.4) contrast(1.2)'},
    {y:'1995', f:'grayscale(0.5) contrast(0.9)'},
    {y:'2003', f:'saturate(1.5)'}
];

// 状态管理
// 字体配置（不使用Google字体，使用系统字体）
const FONT_OPTIONS = [
    { value: 'cursive', name: '手写体', nameEn: 'Handwriting' },
    { value: 'serif', name: '衬线体', nameEn: 'Serif' },
    { value: 'monospace', name: '等宽体', nameEn: 'Monospace' },
    { value: 'sans-serif', name: '无衬线', nameEn: 'Sans-serif' }
];

let memberUnlockedWatermark = false;
try {
    memberUnlockedWatermark = typeof localStorage !== 'undefined'
        && localStorage.getItem('timeframe_member') === 'true';
} catch (err) {
    memberUnlockedWatermark = false;
}

// 拍照次数限制管理
class PhotoLimitManager {
    // 检查是否处于测试模式（仅在本地环境生效）
    static isTestMode() {
        // 只在本地环境（localhost或127.0.0.1）允许测试模式
        const hostname = window.location.hostname;
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
        
        if (!isLocalhost) {
            return false; // 非本地环境，禁用测试模式
        }
        
        // 检查URL参数
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('test') === 'true') {
            return true;
        }
        // 检查localStorage标志
        if (localStorage.getItem('timeframe_test_mode') === 'true') {
            return true;
        }
        return false;
    }
    
    static getTodayKey(type) {
        const today = new Date().toDateString();
        return `photoLimit_${type}_${today}`;
    }
    
    static getCount(type) {
        const key = this.getTodayKey(type);
        const count = localStorage.getItem(key);
        return count ? parseInt(count, 10) : 0;
    }
    
    static increment(type) {
        // 测试模式下不增加计数
        if (this.isTestMode()) {
            return;
        }
        const key = this.getTodayKey(type);
        const count = this.getCount(type);
        localStorage.setItem(key, (count + 1).toString());
    }
    
    static checkLimit(type) {
        // 测试模式下不检查限制
        if (this.isTestMode()) {
            return false;
        }
        const limits = {
            normal: 999,  // 普通照片每天999次
            mystery: 999, // 盲盒照片每天999次
            reveal: 999   // 摇一摇显影每天999次
        };
        const count = this.getCount(type);
        return count >= limits[type];
    }
    
    static getRemaining(type) {
        // 测试模式下返回无限
        if (this.isTestMode()) {
            return Infinity;
        }
        const limits = {
            normal: 999,
            mystery: 999,
            reveal: 999  // 摇一摇显影每天999次
        };
        return Math.max(0, limits[type] - this.getCount(type));
    }
    
    static getLimit(type) {
        const limits = {
            normal: 999,
            mystery: 999,
            reveal: 999  // 摇一摇显影每天999次
        };
        return limits[type];
    }
    
    // 清除所有限制（用于测试）
    static clearAllLimits() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('photoLimit_')) {
                localStorage.removeItem(key);
            }
        });
    }
}

const state = { 
    filterIdx: 0, 
    tm: false, 
    autoDev: true, 
    lightSkin: false, 
    zIndex: 100,
    currentFrame: 'classic',
    currentFont: 'cursive',
    paperTexture: true, // 相纸纹理
    isMember: memberUnlockedWatermark,
    watermark: !memberUnlockedWatermark, // 非会员默认开启水印
    mysteryPhoto: false, // 盲盒照片
    photos: [], // 存储所有照片数据
    mysteryPhotos: [], // 盲盒照片数据
    currentPhotoIndex: 0, // 移动端当前照片索引
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    shutterSoundEnabled: true
};

function escapeAttributeValue(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function getPhotoAltText(photoData = {}, options = {}) {
    const { isMystery = false, revealed = true } = options;
    const caption = photoData?.params?.text?.trim();
    let key = 'defaultPhotoAlt';
    if (isMystery) {
        key = revealed ? 'mysteryRevealAlt' : 'mysteryPhotoAlt';
    }
    const fallback = typeof t === 'function'
        ? (t(key) || 'TimeFrame Photo')
        : 'TimeFrame Photo';
    if (caption) {
        return `${caption} - ${fallback}`;
    }
    return fallback;
}

const SUPPORTS_MOTION_PERMISSION = typeof window !== 'undefined'
    && typeof DeviceMotionEvent !== 'undefined'
    && typeof DeviceMotionEvent.requestPermission === 'function';

let motionPermissionState = SUPPORTS_MOTION_PERMISSION ? 'unknown' : 'granted';
let motionPermissionPromise = null;

function ensureMotionPermission() {
    if (!SUPPORTS_MOTION_PERMISSION) {
        motionPermissionState = 'granted';
        return Promise.resolve(true);
    }
    if (motionPermissionState === 'granted') {
        return Promise.resolve(true);
    }
    if (motionPermissionState === 'denied') {
        return Promise.resolve(false);
    }
    if (!motionPermissionPromise) {
        motionPermissionPromise = DeviceMotionEvent.requestPermission()
            .then((permission) => {
                motionPermissionState = permission === 'granted' ? 'granted' : 'denied';
                return motionPermissionState === 'granted';
            })
            .catch(() => {
                motionPermissionState = 'denied';
                return false;
            })
            .finally(() => {
                // 允许后续根据需要重新发起
                motionPermissionPromise = null;
            });
    }
    return motionPermissionPromise;
}

function getWatermarkText() {
    if (typeof t === 'function') {
        const label = t('watermarkText');
        if (label) return label;
    }
    return 'timeframe.cam';
}

function drawCanvasWatermark(ctx, text, x, y, fontSize = 18) {
    // 暂时移除水印
    return;
    ctx.save();
    ctx.font = `${fontSize}px 'Roboto Mono', 'Roboto', sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 0.5;
    ctx.shadowOffsetY = 0.5;
    ctx.fillText(text, x, y);
    ctx.restore();
}

const IOS_DEVICE_REGEX = /iP(ad|hone|od)/i;

function isIOSDevice() {
    return IOS_DEVICE_REGEX.test(navigator.userAgent || '');
}

async function dataUrlToBlob(dataUrl) {
    const parts = dataUrl.split(',');
    if (parts.length < 2) {
        throw new Error('Invalid dataUrl');
    }
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    const binaryString = atob(parts[1]);
    const len = binaryString.length;
    const buffer = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        buffer[i] = binaryString.charCodeAt(i);
    }
    return new Blob([buffer], { type: mimeType });
}

async function triggerDownload(dataUrl, filename = `TimeFrame_${Date.now()}.png`) {
    try {
        const blob = await dataUrlToBlob(dataUrl);
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.rel = 'noopener';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
        
        if (state.isMobile && isIOSDevice()) {
            // iOS对download属性支持不佳，主动打开预览窗口方便用户保存
            setTimeout(() => {
                const newWindow = window.open(dataUrl, '_blank');
                if (!newWindow) {
                    console.warn('[Download] iOS popup blocked');
                }
            }, 200);
        }
    } catch (err) {
        console.error('[Download] Failed to trigger download', err);
        const fallbackWindow = window.open(dataUrl, '_blank');
        if (!fallbackWindow) {
            alert('下载失败，请长按图片保存');
        }
    }
}

async function sharePhotoFromDataUrl(dataUrl, filename = `TimeFrame_${Date.now()}.png`) {
    if (!navigator.share) {
        return 'unsupported';
    }
    
    const sharePayload = {
        title: typeof t === 'function' ? (t('brand') || document.title) : document.title,
        text: typeof t === 'function' ? (t('slogan') || '') : ''
    };
    
    let file = null;
    try {
        const blob = await dataUrlToBlob(dataUrl);
        file = new File([blob], filename, { type: blob.type || 'image/png' });
    } catch (err) {
        console.warn('[Share] Failed to prepare file payload', err);
    }
    
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({ ...sharePayload, files: [file] });
            return 'shared';
        } catch (err) {
            if (err?.name === 'AbortError') {
                return 'cancelled';
            }
            console.warn('[Share] File share failed, fallback to URL share', err);
        }
    }
    
    try {
        await navigator.share({ ...sharePayload, url: dataUrl });
        return 'shared';
    } catch (err) {
        if (err?.name === 'AbortError') {
            return 'cancelled';
        }
        console.warn('[Share] Native share failed', err);
        return 'failed';
    }
}

// UI元素（延迟初始化，确保DOM已加载）
const ui = {};
function initUI() {
    Object.assign(ui, {
    cam: document.getElementById('cameraBody'),
    video: document.getElementById('video'),
    filters: document.getElementById('filtersBox'),
    themes: document.getElementById('themesBox'),
    rainbow: document.getElementById('rainbow'),
    tmBtn: document.getElementById('tmToggle'),
    autoBtn: document.getElementById('autoDevToggle'),
    skinBtn: document.getElementById('skinBtn'),
    shutter: document.getElementById('shutter'),
    canvas: document.getElementById('canvas'),
    desk: document.getElementById('desk'),
        input: document.getElementById('caption'),
        helpBtn: document.getElementById('helpBtn'),
        settingsBtn: document.getElementById('settingsBtn'),
        langBtn: document.getElementById('langBtn'),
        helpModal: document.getElementById('helpModal'),
        settingsModal: document.getElementById('settingsModal'),
        helpModalClose: document.getElementById('helpModalClose'),
        settingsModalClose: document.getElementById('settingsModalClose'),
        mobileGallery: document.getElementById('mobileGallery'),
        galleryClose: document.getElementById('galleryClose'),
        viewToggle: document.getElementById('viewToggle'),
        cardContainer: document.getElementById('cardContainer'),
        gridView: document.getElementById('gridView'),
        cardDelete: document.getElementById('cardDelete'),
        cardDownload: document.getElementById('cardDownload'),
        frameSelector: document.getElementById('frameSelector'),
        shutterSoundToggle: document.getElementById('shutterSoundToggle'),
        themeToggle: document.getElementById('themeToggle')
    });
}

// 摇一摇显影类（参考文档实现方案）
class ShakeToReveal {
    constructor(imageElement, requiredShakes = 10) {
        this.image = imageElement;
        this.requiredShakes = requiredShakes;
        this.shakeCount = 0;
        this.lastShakeTime = 0;
        this.isActive = true;
        this.isMobile = state.isMobile;
        this.isRevealed = false; // 标记是否已显影
        this.init();
    }

    init() {
        // 初始状态：模糊+亮度高(白色遮挡)
        // 强制设置样式，确保与创建时一致
        this.image.style.filter = 'blur(20px) brightness(1.5)';
        this.image.style.opacity = '0.3';
        this.image.style.transition = 'all 0.3s ease-out';
        
        // 根据设备类型选择实现方案
        if (this.isMobile) {
            // 移动端：使用DeviceMotion API（摇一摇）
            this.initMobileShake();
        } else {
            // 桌面端：使用鼠标晃动
            this.initDesktopMouseShake();
        }
    }
    
    // 移动端：摇一摇实现
    initMobileShake() {
        // 检测设备支持
        if (!window.DeviceMotionEvent) {
            this.initTouchShake();
            return;
        }
        
        if (SUPPORTS_MOTION_PERMISSION) {
            ensureMotionPermission()
                .then((granted) => {
                    if (granted) {
                        this.bindDeviceMotion();
                    } else {
                        this.initTouchShake();
                    }
                })
                .catch(() => this.initTouchShake());
        } else {
            // 直接绑定（Android或旧版iOS）
            this.bindDeviceMotion();
        }
    }
    
    // 绑定设备运动事件
    bindDeviceMotion() {
        this.handleMotion = this.handleMotion.bind(this);
        window.addEventListener('devicemotion', this.handleMotion, true);
    }
    
    // 移动端：触摸摇动（降级方案）
    initTouchShake() {
        let startPos = { x: 0, y: 0 };
        let lastPos = { x: 0, y: 0 };
        let totalDistance = 0;
        let lastShakeTime = 0;
        let isActive = false;
        
        const handleTouchStart = (e) => {
            if (e.target.closest('.close-btn')) return;
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                startPos = { x: touch.clientX, y: touch.clientY };
                lastPos = { x: touch.clientX, y: touch.clientY };
                    totalDistance = 0;
                isActive = true;
            }
        };
        
        const handleTouchMove = (e) => {
            if (!isActive || e.touches.length === 0) return;
            
            const touch = e.touches[0];
            const currentPos = { x: touch.clientX, y: touch.clientY };
            const deltaX = Math.abs(currentPos.x - lastPos.x);
            const deltaY = Math.abs(currentPos.y - lastPos.y);
            const distance = Math.hypot(deltaX, deltaY);
            
            totalDistance += distance;
            lastPos = currentPos;
            
            // 检测快速左右晃动
            const totalDeltaX = Math.abs(currentPos.x - startPos.x);
            const totalDeltaY = Math.abs(currentPos.y - startPos.y);
            
            if (totalDeltaX > totalDeltaY * 1.5 && totalDeltaX > 30) {
                    const now = Date.now();
                if (now - lastShakeTime > 200 && totalDistance > 50) {
                        this.registerShake();
                        lastShakeTime = now;
                        totalDistance = 0;
                    startPos = currentPos;
                }
            }
        };
        
        const handleTouchEnd = () => {
                isActive = false;
        };
        
        this.image.addEventListener('touchstart', handleTouchStart, { passive: true });
        this.image.addEventListener('touchmove', handleTouchMove, { passive: true });
        this.image.addEventListener('touchend', handleTouchEnd);
        this.image.addEventListener('touchcancel', handleTouchEnd);
        
    }
    
    // 桌面端：鼠标晃动实现（参考文档）
    initDesktopMouseShake() {
        let isMouseDown = false;
        let lastX = 0;
        let lastY = 0;
        let lastMoveTime = 0;
        let startX = 0;
        let startY = 0;
        let totalDistance = 0;
        let isShaking = false; // 标记是否为晃动模式（而非拖动）
            let dragStartTime = 0;
        
        const polaroidDiv = this.image.closest('.polaroid');
        
        // 鼠标按下 - 在图片或photo-frame上按下时，检测晃动
        // 注意：不阻止事件传播，让拖动功能也能工作
        // 通过检测移动速度和方向来区分是晃动还是拖动
        // 使用 capture 阶段，确保在 makeDraggable 之前捕获事件
        // 绑定到图片的父元素（photo-frame）上，因为用户可能点击的是photo-frame而不是img
        const photoFrame = this.image.parentElement;
        const targetElement = photoFrame && photoFrame.classList.contains('photo-frame') ? photoFrame : this.image;
        
        // 保存事件处理器引用，以便后续移除
        this._mouseDownHandler = (e) => {
            
            // 处理点击图片或photo-frame的情况
            const clickedOnImage = e.target === this.image || this.image.contains(e.target);
            const clickedOnPhotoFrame = e.target === photoFrame || e.target.closest('.photo-frame') === photoFrame;
            
            if (!clickedOnImage && !clickedOnPhotoFrame) {
                return;
            }
            if (e.target.closest('.close-btn')) {
                return;
            }
            if (e.button !== 0) {
                return; // 只处理左键
            }
            
            // 如果polaroid已经在拖动（且是已显影照片），不处理
            // 未显影照片允许拖动，但不设置 dragging 标记，所以这里不阻止
            if (polaroidDiv && polaroidDiv.dataset.dragging === 'true') {
                const photoId = polaroidDiv.dataset.photoId;
                if (photoId) {
                    const photo = state.photos.find(p => p.timestamp === parseInt(photoId));
                    if (photo && photo.revealed) {
                        // 已显影照片正在拖动，不处理
                        return;
                    }
                }
            }
            
            // 未显影照片，允许检测晃动
            
            isMouseDown = true;
            lastX = e.clientX;
            lastY = e.clientY;
            startX = e.clientX;
            startY = e.clientY;
            lastMoveTime = Date.now();
            dragStartTime = Date.now();
            totalDistance = 0;
            isShaking = false;
            
            this.image.style.cursor = 'grabbing';
            // 不阻止事件传播，让拖动功能也能检测到
        };
        
        targetElement.addEventListener('mousedown', this._mouseDownHandler, true); // 使用 capture 阶段，确保在 makeDraggable 之前捕获事件
        
        // 鼠标移动 - 在document上监听，捕获所有移动
        const handleMouseMove = (e) => {
            // 只在鼠标按下且激活时处理
            if (!isMouseDown) {
                return;
            }
            
            if (!this.isActive) {
                return;
            }
            
            if (this.isRevealed) {
                return;
            }
            
            // 如果polaroid已经在拖动（且是已显影照片），停止晃动检测
            // 未显影照片允许拖动，但不设置 dragging 标记，所以这里不阻止
            if (polaroidDiv && polaroidDiv.dataset.dragging === 'true') {
                // 检查是否是未显影照片（未显影照片不设置 dragging，所以不会到这里）
                const photoId = polaroidDiv.dataset.photoId;
                if (photoId) {
                    const photo = state.photos.find(p => p.timestamp === parseInt(photoId));
                    if (photo && !photo.revealed) {
                        // 未显影照片，允许继续检测晃动
                    } else {
                        // 已显影照片正在拖动，停止晃动检测
                        isMouseDown = false;
                        isShaking = false;
                        return;
                    }
                } else {
                    // 没有 photoId，可能是其他元素，停止检测
                    isMouseDown = false;
                    isShaking = false;
                    return;
                }
            }
            
            const currentX = e.clientX;
            const currentY = e.clientY;
            const currentTime = Date.now();
            
            // 计算移动距离和速度
            const deltaX = currentX - lastX;
            const deltaY = currentY - lastY;
            const deltaTime = currentTime - lastMoveTime;
            
            if (deltaTime === 0) return;
            
            // 计算总移动距离
            const totalDeltaX = Math.abs(currentX - startX);
            const totalDeltaY = Math.abs(currentY - startY);
            
            // 速度 = 距离 / 时间(像素/毫秒)
            const velocity = Math.hypot(deltaX, deltaY) / deltaTime;
            
            // 判断是晃动还是拖动
            // 晃动：快速水平移动（速度 > 0.5像素/毫秒，水平距离 > 垂直距离 * 1.2）
            // 拖动：缓慢移动或垂直移动为主
            const SHAKE_VELOCITY_THRESHOLD = 0.5; // 降低到0.5像素/毫秒
            const MIN_DISTANCE = 15; // 降低到15px
            
            // 如果移动时间很短（< 500ms）且速度很快，可能是晃动
            const moveDuration = currentTime - dragStartTime;
            
            
            // 降低晃动检测的阈值，让拖动时的快速移动也能被识别为晃动
            // 关键：只要速度够快且是水平移动，就认为是晃动
            if (velocity > SHAKE_VELOCITY_THRESHOLD && totalDeltaX > MIN_DISTANCE) {
                // 判断是否为水平晃动（水平距离大于垂直距离）
                // 降低比例要求，从 1.2 改为 1.0，更容易触发
                if (totalDeltaX > totalDeltaY * 1.0 || totalDeltaY < 10) {
                    isShaking = true;
                    totalDistance += Math.abs(deltaX);
                    
                    // 每移动15像素算一次晃动（降低阈值，更容易触发）
                    if (totalDistance >= 15) {
                        const now = Date.now();
                        if (now - this.lastShakeTime > 100) { // 防抖100ms，避免过于频繁
                            this.registerShake();
                            this.lastShakeTime = now;
                            totalDistance = 0;
                            // 重置起始位置，避免累计过大
                            startX = currentX;
                            startY = currentY;
                        }
                    }
                }
            } else if (totalDeltaX < 5 && totalDeltaY < 5) {
                // 移动很小，可能是点击，不处理
            } else if (moveDuration > 1000 || velocity < 0.1) {
                // 移动时间很长（1秒以上）或速度很慢，可能是拖动，不处理晃动
                isShaking = false;
            }
            
            lastX = currentX;
            lastY = currentY;
            lastMoveTime = currentTime;
        };
        
        // 不使用capture阶段，避免干扰拖动功能
        document.addEventListener('mousemove', handleMouseMove);
        
        // 鼠标松开
        const handleMouseUp = () => {
            if (!isMouseDown) return;
            
            isMouseDown = false;
            isShaking = false;
            this.image.style.cursor = 'grab';
        };
        
        document.addEventListener('mouseup', handleMouseUp);
        
        // 鼠标离开窗口
        document.addEventListener('mouseleave', handleMouseUp);
        
        // 保存引用以便清理
        this._mouseMoveHandler = handleMouseMove;
        this._mouseUpHandler = handleMouseUp;
        
        this.image.style.cursor = 'grab';
        this.image.style.userSelect = 'none';
        
    }

    // 处理设备运动事件（移动端）
    handleMotion(event) {
        const accel = event.accelerationIncludingGravity;
        if (!accel) return;
        const totalAccel = Math.abs(accel.x) + Math.abs(accel.y) + Math.abs(accel.z);
        
        // 摇动阈值(经验值)
        if (totalAccel > 25) {
            const now = Date.now();
            if (now - this.lastShakeTime > 300) {  // 防抖
                this.registerShake();
                this.lastShakeTime = now;
            }
        }
    }

    registerShake() {
        if (!this.isActive || this.isRevealed) return;
        
        // 检查摇一摇显影次数限制
        if (!PhotoLimitManager.isTestMode()) {
            if (PhotoLimitManager.checkLimit('reveal')) {
                // 达到限制，显示提示并停止显影
                showLimitModal('reveal');
                return;
            }
        }
        
        this.shakeCount++;
        
        // 触觉反馈
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        this.updateReveal();
        
        if (this.shakeCount >= this.requiredShakes) {
            // 显影完成，增加摇一摇显影次数计数
            if (!PhotoLimitManager.isTestMode()) {
                PhotoLimitManager.increment('reveal');
            }
            this.onComplete();
        }
    }

    updateReveal() {
        const progress = Math.min(this.shakeCount / this.requiredShakes, 1);
        
        // 线性插值
        const blur = 20 * (1 - progress);
        const brightness = 1.5 - 0.5 * progress;
        const opacity = 0.3 + 0.7 * progress;
        
        this.image.style.filter = `blur(${blur}px) brightness(${brightness})`;
        this.image.style.opacity = opacity;
        
        // 更新进度指示器
        this.updateIndicator();
    }

    createIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'shakeIndicator';
        indicator.className = 'shake-indicator';
        indicator.textContent = t('shakeProgress', {current: 0, total: this.requiredShakes});
        document.body.appendChild(indicator);
    }

    updateIndicator() {
        let indicator = document.getElementById('shakeIndicator');
        if (!indicator) {
            this.createIndicator();
            indicator = document.getElementById('shakeIndicator');
        }
        
        if (indicator) {
            indicator.textContent = t('shakeProgress', {current: this.shakeCount, total: this.requiredShakes});
            
            // 脉动效果
            indicator.style.transform = 'translateX(-50%) scale(1.1)';
            setTimeout(() => {
                indicator.style.transform = 'translateX(-50%) scale(1)';
            }, 100);
            
            // 进度条效果
            const progress = Math.min(this.shakeCount / this.requiredShakes, 1);
            indicator.style.background = `linear-gradient(90deg, rgba(255,173,51,${0.8 + progress * 0.2}) ${progress * 100}%, rgba(0,0,0,0.8) ${progress * 100}%)`;
        }
    }

    removeIndicator() {
        const indicator = document.getElementById('shakeIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    onComplete() {
        this.isActive = false;
        this.isRevealed = true;
        
        // 移除进度指示器
        this.removeIndicator();
        
        // 确保完全清晰 - 强制设置样式
        this.image.style.filter = 'none';
        this.image.style.opacity = '1';
        this.image.style.transition = 'all 0.3s ease-out';
        
        // 移除覆盖层（如果有）
        const photoFrame = this.image.parentElement;
        if (photoFrame) {
            const overlay = photoFrame.querySelector('.develop-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 0.3s';
                setTimeout(() => overlay.remove(), 300);
            }
        }
        
        // 强制重绘，确保样式立即生效
        this.image.offsetHeight; // 触发重排
        
        // 移除事件监听
        if (this.handleMotion) {
            window.removeEventListener('devicemotion', this.handleMotion, true);
        }
        if (this._mouseMoveHandler) {
            document.removeEventListener('mousemove', this._mouseMoveHandler);
        }
        if (this._mouseUpHandler) {
            document.removeEventListener('mouseup', this._mouseUpHandler);
            document.removeEventListener('mouseleave', this._mouseUpHandler);
        }
        
        // 移除 mousedown 事件监听器（如果保存了引用）
        if (this._mouseDownHandler) {
            const photoFrame = this.image.parentElement;
            const targetElement = photoFrame && photoFrame.classList.contains('photo-frame') ? photoFrame : this.image;
            targetElement.removeEventListener('mousedown', this._mouseDownHandler, true);
        }
        
        this.image.style.cursor = 'default';
        
        // 更新照片数据中的显影状态
        const polaroidDiv = this.image.closest('.polaroid');
        if (polaroidDiv && polaroidDiv.dataset.photoId) {
            const timestamp = parseInt(polaroidDiv.dataset.photoId);
            const photo = state.photos.find(p => p.timestamp === timestamp);
            if (photo) {
                photo.revealed = true; // 标记为已显影
                // 保存显影状态
                savePhotosToStorage().catch(e => console.error('[ShakeToReveal] Failed to save reveal state:', e));
            }
        }
        
        // 触发完成事件
        this.image.dispatchEvent(new CustomEvent('revealComplete'));
    }
    
    // 销毁实例
    destroy() {
        this.isActive = false;
        if (this.handleMotion) {
            window.removeEventListener('devicemotion', this.handleMotion, true);
        }
        if (this._mouseMoveHandler) {
            document.removeEventListener('mousemove', this._mouseMoveHandler);
        }
        if (this._mouseUpHandler) {
            document.removeEventListener('mouseup', this._mouseUpHandler);
            document.removeEventListener('mouseleave', this._mouseUpHandler);
        }
    }

}

// 初始化
async function init() {
    initUI(); // 初始化UI元素
    
    // 检测测试模式
    if (PhotoLimitManager.isTestMode()) {
        // 如果通过URL参数启用，也设置localStorage标志
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('test') === 'true') {
            localStorage.setItem('timeframe_test_mode', 'true');
        }
    }
    
    try {
        const s = await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:800,height:800}});
        ui.video.srcObject = s;
    } catch(e) { 
        alert('请使用HTTPS或本地环境'); 
    }
    renderFilters();
    renderThemes();
    initFrameSelector();
    initEventListeners();
    updatePageLanguage();
    loadPhotosFromStorage(); // 加载普通照片
    loadMysteryPhotos(); // 加载盲盒照片
    
    // 检测移动端，显示照片墙入口
    if (state.isMobile) {
        showMobileGalleryButton();
    }
}

let galleryShakeHelper = null;

function stopGalleryShakeHelper() {
    if (galleryShakeHelper) {
        galleryShakeHelper.destroy();
        galleryShakeHelper = null;
    }
}

class GalleryShakeHelper {
    constructor(options = {}) {
        this.requiredShakes = options.requiredShakes || 10;
        this.onComplete = options.onComplete;
        this.onProgress = options.onProgress;
        this.target = options.target || null;
        this.shakeCount = 0;
        this.lastShakeTime = 0;
        this.active = true;
        this.touchActive = false;
        this.startPos = { x: 0, y: 0 };
        this.lastPos = { x: 0, y: 0 };
        this.totalDistance = 0;
        
        this.handleMotion = this.handleMotion.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        
        this.init();
    }
    
    async init() {
        if (SUPPORTS_MOTION_PERMISSION) {
            const granted = await ensureMotionPermission().catch(() => false);
            if (granted) {
                window.addEventListener('devicemotion', this.handleMotion, true);
                return;
            }
            console.warn('[GalleryShake] Motion permission denied, fallback to touch');
            this.enableTouchFallback();
            return;
        }
        
        if ('ondevicemotion' in window) {
            window.addEventListener('devicemotion', this.handleMotion, true);
        } else {
            this.enableTouchFallback();
        }
    }
    
    enableTouchFallback() {
        const target = this.target || document.body;
        target.addEventListener('touchstart', this.handleTouchStart, { passive: true });
        target.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        target.addEventListener('touchend', this.handleTouchEnd);
        target.addEventListener('touchcancel', this.handleTouchEnd);
    }
    
    handleTouchStart(e) {
        if (e.touches.length === 0) return;
        const touch = e.touches[0];
        this.touchActive = true;
        this.startPos = { x: touch.clientX, y: touch.clientY };
        this.lastPos = { x: touch.clientX, y: touch.clientY };
        this.totalDistance = 0;
    }
    
    handleTouchMove(e) {
        if (!this.touchActive || e.touches.length === 0) return;
        const touch = e.touches[0];
        const currentPos = { x: touch.clientX, y: touch.clientY };
        const deltaX = Math.abs(currentPos.x - this.lastPos.x);
        const deltaY = Math.abs(currentPos.y - this.lastPos.y);
        const distance = Math.hypot(deltaX, deltaY);
        this.totalDistance += distance;
        this.lastPos = currentPos;
        
        const totalDeltaX = Math.abs(currentPos.x - this.startPos.x);
        const totalDeltaY = Math.abs(currentPos.y - this.startPos.y);
        
        if ((totalDeltaX > totalDeltaY * 1.2 && totalDeltaX > 30) || totalDeltaY < 12) {
            if (this.totalDistance > 60) {
                this.totalDistance = 0;
                this.startPos = currentPos;
                this.incrementShake();
            }
        }
    }
    
    handleTouchEnd() {
        this.touchActive = false;
        this.totalDistance = 0;
    }
    
    handleMotion(event) {
        if (!this.active) return;
        const accel = event.accelerationIncludingGravity;
        if (!accel) return;
        const totalAccel = Math.abs(accel.x) + Math.abs(accel.y) + Math.abs(accel.z);
        if (totalAccel > 22) {
            const now = Date.now();
            if (now - this.lastShakeTime > 250) {
                this.lastShakeTime = now;
                this.incrementShake();
            }
        }
    }
    
    incrementShake() {
        if (!this.active) return;
        this.shakeCount++;
        if (typeof this.onProgress === 'function') {
            this.onProgress(this.shakeCount, this.requiredShakes);
        }
        if (this.shakeCount >= this.requiredShakes) {
            this.complete();
        }
    }
    
    complete() {
        if (!this.active) return;
        this.active = false;
        this.destroy();
        if (typeof this.onComplete === 'function') {
            this.onComplete();
        }
    }
    
    destroy() {
        window.removeEventListener('devicemotion', this.handleMotion, true);
        const target = this.target || document.body;
        target.removeEventListener('touchstart', this.handleTouchStart);
        target.removeEventListener('touchmove', this.handleTouchMove);
        target.removeEventListener('touchend', this.handleTouchEnd);
        target.removeEventListener('touchcancel', this.handleTouchEnd);
        this.active = false;
    }
}

// 压缩图片（将base64 PNG转换为JPEG，降低质量）
function compressImage(base64DataUrl, quality = 0.75) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            // 转换为JPEG格式，降低质量
            const compressed = canvas.toDataURL('image/jpeg', quality);
            resolve(compressed);
        };
        img.onerror = () => {
            // 如果压缩失败，返回原始数据
            resolve(base64DataUrl);
        };
        img.src = base64DataUrl;
    });
}

// 估算数据大小（字节）
function estimateDataSize(data) {
    return new Blob([JSON.stringify(data)]).size;
}

// 保存普通照片到localStorage（使用压缩）
async function savePhotosToStorage() {
    try {
        // 压缩并保存照片
        const photosToSave = await Promise.all(
            state.photos.map(async (photo) => {
                // 验证照片数据完整性 - 修复：检查framedSrc而不是src
                if (!photo.timestamp || !photo.framedSrc) {
                    return null;
                }
                
                // 只保存framedSrc（最终显示的），不保存src（原始）
                // 压缩framedSrc以减少存储空间
                let compressedFramedSrc = photo.framedSrc;
                if (compressedFramedSrc && compressedFramedSrc.startsWith('data:image/png')) {
                    try {
                        compressedFramedSrc = await compressImage(compressedFramedSrc, 0.75);
                    } catch (e) {
                    }
                }
                
                return {
                    timestamp: photo.timestamp,
                    params: photo.params || {},
                    // 只保存framedSrc（压缩后的）
                    framedSrc: compressedFramedSrc,
                    // 保存显影状态
                    revealed: photo.revealed || false
                };
            })
        );
        
        const validPhotos = photosToSave.filter(photo => photo !== null);
        
        if (validPhotos.length === 0) {
            localStorage.removeItem('timeframe_photos');
            return;
        }
        
        // 检查数据大小
        const dataSize = estimateDataSize(validPhotos);
        const maxSize = 4 * 1024 * 1024; // 4MB限制（留出安全空间）
        
        
        if (dataSize > maxSize) {
            // 保留最近的照片
            let keepCount = 50;
            while (keepCount > 0) {
                const recentPhotos = validPhotos.slice(-keepCount);
                const recentSize = estimateDataSize(recentPhotos);
                if (recentSize <= maxSize) {
                    try {
                        localStorage.setItem('timeframe_photos', JSON.stringify(recentPhotos));
                        return;
                    } catch (e) {
                        console.error(`[PhotoStorage] Failed to save ${keepCount} photos:`, e);
                        keepCount -= 10;
                        continue;
                    }
                }
                keepCount -= 10;
            }
            // 最后尝试：只保留5张
            try {
                localStorage.setItem('timeframe_photos', JSON.stringify(validPhotos.slice(-5)));
                console.error('[PhotoStorage] Could only save 5 photos due to size limit');
            } catch (e) {
                console.error('[PhotoStorage] Complete storage failure:', e);
            }
        } else {
            try {
                localStorage.setItem('timeframe_photos', JSON.stringify(validPhotos));
            } catch (e) {
                // 如果还是失败，尝试保存更少的照片
                console.error('[PhotoStorage] Storage failed, trying to save fewer photos:', e);
                try {
                    const fewerPhotos = validPhotos.slice(-Math.floor(validPhotos.length * 0.7));
                    localStorage.setItem('timeframe_photos', JSON.stringify(fewerPhotos));
                } catch (e2) {
                    console.error('[PhotoStorage] Complete storage failure:', e2);
                }
            }
        }
    } catch (e) {
        console.error('[PhotoStorage] Failed to save photos:', e);
        // 如果存储失败，尝试保存更少的数据（不压缩，直接保存）
        try {
            const photosToSave = state.photos.slice(-20).map(photo => {
                if (!photo.timestamp || !photo.framedSrc) return null;
                return {
                    timestamp: photo.timestamp,
                    params: photo.params || {},
                    framedSrc: photo.framedSrc, // 只保存framedSrc
                    revealed: photo.revealed || false
                };
            }).filter(photo => photo !== null);
            
            localStorage.setItem('timeframe_photos', JSON.stringify(photosToSave));
        } catch (e2) {
            console.error('[PhotoStorage] Failed to save photos even after cleanup:', e2);
        }
    }
}

function removePhotoFromStorage(timestamp) {
    if (!timestamp) return;
    
    try {
        const stored = JSON.parse(localStorage.getItem('timeframe_photos') || '[]');
        if (!Array.isArray(stored) || stored.length === 0) {
            return;
        }
        
        const filtered = stored.filter(photo => photo.timestamp !== timestamp);
        if (filtered.length === stored.length) {
            return;
        }
        
        if (filtered.length === 0) {
            localStorage.removeItem('timeframe_photos');
        } else {
            localStorage.setItem('timeframe_photos', JSON.stringify(filtered));
        }
    } catch (err) {
        console.error('[PhotoStorage] Failed to remove photo from storage:', err);
    }
}

// 加载已保存的普通照片
function loadPhotosFromStorage() {
    try {
        const stored = JSON.parse(localStorage.getItem('timeframe_photos') || '[]');
        if (stored.length === 0) return;
        
        state.photos = stored;
        
        // 恢复照片显示（桌面端）
        if (!state.isMobile) {
            stored.forEach(photoData => {
                const frameType = photoData.params?.frame || state.currentFrame || 'classic';
                const div = document.createElement('div');
                div.className = 'polaroid';
                div.dataset.photoId = photoData.timestamp;
                div.dataset.frameType = frameType;
                
                // 应用相框样式
                const frame = frameTemplates[frameType] || frameTemplates.classic;
                if (frame.background.includes('gradient')) {
                    const gradientMatch = frame.background.match(/linear-gradient\([^)]+\)/);
                    if (gradientMatch) {
                        div.style.background = gradientMatch[0];
                    } else {
                        div.style.background = '#FFFFFF';
                    }
                } else {
                    div.style.background = frame.background || '#FFFFFF';
                }
                
                if (state.paperTexture) {
                    div.classList.add('has-paper-texture');
                }
                
                // 随机位置
                const endX = Math.random() * (window.innerWidth - 280) + 20;
                const endY = window.innerHeight/2 + Math.random()*(window.innerHeight/3);
                const endRot = (Math.random()-0.5)*30;
                div.style.left = endX + 'px';
                div.style.top = endY + 'px';
                div.style.transform = `scale(1) rotate(${endRot}deg)`;
                div.style.position = 'absolute';
                div.style.opacity = '1';
                
                const framedSrc = photoData.framedSrc || photoData.src;
                const restoredAlt = escapeAttributeValue(
                    getPhotoAltText(photoData, { isMystery: false, revealed: photoData.revealed !== false })
                );
                div.innerHTML = `
                    <div class="close-btn"><svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></div>
                    <div class="photo-frame"><img src="${framedSrc}" alt="${restoredAlt}" loading="lazy"></div>
                `;
                
                const captionText = (photoData.params?.text || '').trim();
                const yearText = (photoData.params?.year || '').trim();
                if(captionText || yearText) {
                    const textWrap = document.createElement('div');
                    textWrap.className = 'p-text';
                    const selectedFont = state.currentFont || frame.font || 'cursive';
                    textWrap.style.fontFamily = selectedFont;
                    textWrap.style.color = frame.textColor || '#333';
                    
                    if(captionText) {
                        const span = document.createElement('span');
                        span.textContent = captionText;
                        span.style.color = frame.textColor || '#333';
                        textWrap.appendChild(span);
                    }
                    if(yearText) {
                        const small = document.createElement('small');
                        small.textContent = yearText;
                        small.style.color = frame.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)';
                        textWrap.appendChild(small);
                    }
                    div.appendChild(textWrap);
                }
                
                // 双击下载
                div.ondblclick = async (e) => {
                    e.stopPropagation();
                    const dataUrl = await renderPolaroidForDownload(framedSrc, photoData.params?.text, photoData.params?.year, frameType);
                    await triggerDownload(dataUrl);
                    const endRot = parseFloat(div.style.transform.match(/rotate\(([^)]+)\)/)?.[1] || '0');
                    div.style.transform = `scale(1.05) rotate(${endRot}deg)`;
                    setTimeout(() => div.style.transform = `scale(1) rotate(${endRot}deg)`, 150);
                };
                
                div.querySelector('.close-btn').onclick = (e) => { 
                    e.stopPropagation(); 
                    const index = state.photos.findIndex(p => p.timestamp === photoData.timestamp);
                    if (index > -1) state.photos.splice(index, 1);
                    removePhotoFromStorage(photoData.timestamp);
                    // 移除进度指示器
                    const indicator = document.getElementById('shakeIndicator');
                    if (indicator) {
                        indicator.remove();
                    }
                    div.remove();
                };
                
                ui.desk.appendChild(div);
                state.zIndex++; div.style.zIndex = state.zIndex;
                
                // 检查显影状态
                const img = div.querySelector('img');
                const isRevealed = photoData.revealed === true;
                
                // 等待图片加载完成后再处理
                if (img.complete) {
                    handleImageReady();
                } else {
                    img.onload = handleImageReady;
                    img.onerror = handleImageReady; // 即使加载失败也要处理
                }
                
                function handleImageReady() {
                    if (isRevealed) {
                        // 已显影，直接显示并绑定拖动功能
                        img.style.opacity = '1';
                        img.style.filter = 'none';
                        img.style.transition = 'all 0.3s ease-out';
                        // 确保div可以拖动
                        makeDraggable(div);
                    } else {
                        // 未显影：先设置模糊样式，然后绑定摇动功能和拖动功能
                        // 强制设置样式，确保与创建时一致（图4的样式）
                        img.style.filter = 'blur(20px) brightness(1.5)';
                        img.style.opacity = '0.3';
                        img.style.transition = 'all 0.3s ease-out';
                        
                        // 绑定摇动显影功能（ShakeToReveal.init() 会再次设置样式，确保一致）
                        const shakeToReveal = new ShakeToReveal(img, 10);
                        
                        // 确保样式在 ShakeToReveal 初始化后仍然正确
                        // 延迟一点确保 ShakeToReveal.init() 执行完成
                        setTimeout(() => {
                            img.style.filter = 'blur(20px) brightness(1.5)';
                            img.style.opacity = '0.3';
                            img.style.transition = 'all 0.3s ease-out';
                        }, 10);
                        
                        // 桌面端立即绑定拖动功能，让用户能够拖动照片来晃动
                        if (!state.isMobile) {
                            makeDraggable(div);
                        }
                        
                        // 监听显影完成事件，更新照片数据
                        img.addEventListener('revealComplete', () => {
                            // 更新照片数据
                            const photo = state.photos.find(p => p.timestamp === photoData.timestamp);
                            if (photo) {
                                photo.revealed = true;
                                savePhotosToStorage().catch(e => console.error('[PhotoStorage] Failed to save reveal state:', e));
                            }
                        }, { once: true });
                    }
                }
            });
        }
        
        // 移动端：更新照片墙
        if (state.isMobile) {
            updateMobileGallery();
        }
    } catch (e) {
        console.error('Failed to load photos', e);
    }
}

// 检查盲盒照片是否可以揭晓（定时检查）
function checkMysteryPhotosReveal() {
    const now = Date.now();
    state.mysteryPhotos.forEach(mystery => {
        if (!mystery.revealed && mystery.revealTime <= now) {
            // 可以揭晓，自动揭晓
            MysteryPhoto.reveal(mystery.id);
        }
    });
}

// 加载已保存的盲盒照片
function loadMysteryPhotos() {
    try {
        const stored = JSON.parse(localStorage.getItem('timeframe_mystery') || '[]');
        state.mysteryPhotos = stored;
        
        // 先检查是否有可以揭晓的盲盒照片
        checkMysteryPhotosReveal();
        
        // 显示所有盲盒照片（包括未揭晓、可揭晓、已揭晓）
        stored.forEach(mystery => {
            const now = Date.now();
            const timeRemaining = mystery.revealTime - now;
            const canReveal = timeRemaining <= 0 && !mystery.revealed;
            
            // 创建卡片
            const card = MysteryPhoto.createCard(mystery);
            
            if (canReveal) {
                // 可以揭晓，显示在页面上
                card.className = 'polaroid mystery-polaroid';
            } else if (mystery.revealed) {
                // 已揭晓，显示照片
                card.className = 'polaroid';
            } else {
                // 未揭晓（倒计时中），也显示在页面上
                card.className = 'polaroid mystery-polaroid';
            }
            
            // 桌面端：随机位置显示
            if (!state.isMobile) {
                // 确保盲盒照片的尺寸与普通照片一致
                // 使用与普通照片相同的样式类名和结构
                if (mystery.revealed) {
                    // 已揭晓的照片，使用普通照片的样式
                    card.className = 'polaroid';
                } else {
                    // 未揭晓或可揭晓，保持 mystery-polaroid 样式
                    // 但确保尺寸一致
                    card.style.width = '280px'; // 与普通照片一致的宽度
                    card.style.height = 'auto'; // 高度自适应
                }
                
                const endX = Math.random() * (window.innerWidth - 280) + 20;
                const endY = window.innerHeight/2 + Math.random()*(window.innerHeight/3);
                const endRot = (Math.random()-0.5)*30;
                card.style.left = endX + 'px';
                card.style.top = endY + 'px';
                card.style.transform = `scale(1) rotate(${endRot}deg)`;
                card.style.position = 'absolute';
                card.style.opacity = '1';
                state.zIndex++; card.style.zIndex = state.zIndex;
                ui.desk.appendChild(card);
                
                // 桌面端：绑定拖动功能（已揭晓的照片）
                if (mystery.revealed) {
                    makeDraggable(card);
                }
            }
            // 移动端：盲盒照片也会在照片墙中显示（通过state.mysteryPhotos）
        });
        
        // 设置定时器，每10秒检查一次是否可以揭晓
        if (!window.mysteryCheckInterval) {
            window.mysteryCheckInterval = setInterval(() => {
                checkMysteryPhotosReveal();
            }, 10000); // 每10秒检查一次
        }
    } catch (e) {
        console.error('Failed to load mystery photos', e);
    }
}

function renderFilters() {
    if (!ui.filters) return;
    ui.filters.innerHTML = '';
    FILTERS.forEach((f, i) => {
        const d = document.createElement('div');
        d.className = `filter-dot ${i===state.filterIdx ? 'active' : ''}`;
        d.style.background = f.c;
        d.onclick = () => { state.filterIdx = i; state.tm = false; updateState(); };
        d.title = t(`filters.${f.n}`);
        ui.filters.appendChild(d);
    });
}

// 渲染主题模式选择器
function renderThemes() {
    if (!ui.themes) return;
    ui.themes.innerHTML = '';
    Object.keys(photoThemes).forEach((key) => {
        const theme = photoThemes[key];
        const d = document.createElement('div');
        d.className = 'theme-item';
        d.onclick = () => {
            // 应用主题设置
            const frame = frameTemplates[theme.frame];
            if (frame) {
                state.currentFrame = theme.frame;
                updateFrameSelector();
            }
            // 应用滤镜
            const filterIndex = FILTERS.findIndex(f => f.n === theme.filter);
            if (filterIndex !== -1) {
                state.filterIdx = filterIndex;
                state.tm = false;
                updateState();
            }
        };
        d.title = theme.description;
        d.innerHTML = `
            <div class="theme-preview" style="background: ${frameTemplates[theme.frame].background};"></div>
            <span class="theme-name" data-i18n="${theme.nameKey}">${t(theme.nameKey)}</span>
        `;
        ui.themes.appendChild(d);
    });
}

function initFrameSelector() {
    if (!ui.frameSelector) return;
    ui.frameSelector.innerHTML = '';
    Object.keys(frameTemplates).forEach(key => {
        const frame = frameTemplates[key];
        const btn = document.createElement('button');
        btn.className = `frame-option ${state.currentFrame === key ? 'active' : ''}`;
        btn.style.background = frame.background;
        btn.onclick = () => {
            state.currentFrame = key;
            updateFrameSelector();
        };
        btn.title = t(frame.nameKey);
        ui.frameSelector.appendChild(btn);
    });
}

function updateFrameSelector() {
    if (!ui.frameSelector) return;
    Array.from(ui.frameSelector.children).forEach((btn, i) => {
        const key = Object.keys(frameTemplates)[i];
        btn.classList.toggle('active', state.currentFrame === key);
    });
}

// 显示次数限制弹窗
const LIMIT_MODAL_COPY = {
    mystery: { title: 'limitMysteryTitle', desc: 'limitMysteryDesc' },
    reveal: { title: 'limitRevealTitle', desc: 'limitRevealDesc' },
    normal: { title: 'limitNormalTitle', desc: 'limitNormalDesc' }
};

function renderLimitModalCopy(type) {
    const limitMessage = document.getElementById('limitMessage');
    if (!limitMessage) return;
    
    const limit = PhotoLimitManager.getLimit(type);
    const copy = LIMIT_MODAL_COPY[type] || LIMIT_MODAL_COPY.normal;
    limitMessage.innerHTML = `
        <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold; color: #ff3b30;">${t(copy.title)}</p>
        <p style="margin: 0; color: #666;">${t(copy.desc, { limit })}</p>
    `;
}

function showLimitModal(type) {
    const limitModal = document.getElementById('limitModal');
    if (limitModal) {
        limitModal.dataset.photoType = type;
        renderLimitModalCopy(type);
        limitModal.style.display = 'flex';
    }
}

// 关闭次数限制弹窗
function closeLimitModal() {
    const limitModal = document.getElementById('limitModal');
    if (limitModal) {
        const photoType = limitModal.dataset.photoType;
        
        // 如果是盲盒照片达到上限，关闭弹窗时自动关闭盲盒照片开关
        if (photoType === 'mystery') {
            state.mysteryPhoto = false;
            const mysteryPhotoToggle = document.getElementById('mysteryPhotoToggle');
            if (mysteryPhotoToggle) {
                mysteryPhotoToggle.checked = false;
            }
        }
        
        // 清除保存的类型
        delete limitModal.dataset.photoType;
        limitModal.style.display = 'none';
    }
}

function initEventListeners() {
    // 语言切换
    if (ui.langBtn) {
        ui.langBtn.onclick = () => {
            const newLang = currentLang === 'zh' ? 'en' : 'zh';
            setLanguage(newLang);
        };
    }
    
    // 帮助按钮
    if (ui.helpBtn) {
        ui.helpBtn.onclick = () => {
            ui.helpModal.style.display = 'flex';
            // 移动端：阻止背景滚动，但允许弹窗内容滚动
            if (state.isMobile) {
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
            }
        };
    }
    if (ui.helpModalClose) {
        ui.helpModalClose.onclick = () => {
            ui.helpModal.style.display = 'none';
            // 移动端：恢复背景滚动
            if (state.isMobile) {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
            }
        };
    }
    
    // 次数限制弹窗关闭事件
    const limitModalClose = document.getElementById('limitModalClose');
    const limitConfirmBtn = document.getElementById('limitConfirmBtn');
    if (limitModalClose) {
        limitModalClose.onclick = () => {
            closeLimitModal();
        };
    }
    if (limitConfirmBtn) {
        limitConfirmBtn.onclick = () => {
            closeLimitModal();
        };
    }
    // 点击弹窗外部关闭
    const limitModal = document.getElementById('limitModal');
    if (limitModal) {
        limitModal.onclick = (e) => {
            if (e.target === limitModal) {
                closeLimitModal();
            }
        };
    }
    
    // 设置按钮
    if (ui.settingsBtn) {
        ui.settingsBtn.onclick = () => {
            ui.settingsModal.style.display = 'flex';
            // 移动端：阻止背景滚动，但允许弹窗内容滚动
            if (state.isMobile) {
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.width = '100%';
            }
        };
    }
    if (ui.settingsModalClose) {
        ui.settingsModalClose.onclick = () => {
            ui.settingsModal.style.display = 'none';
            // 移动端：恢复背景滚动
            if (state.isMobile) {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.width = '';
            }
        };
    }
    
    // 点击弹窗背景关闭（移动端也需要处理滚动）
    if (ui.helpModal) {
        ui.helpModal.onclick = (e) => {
            if (e.target === ui.helpModal) {
                ui.helpModal.style.display = 'none';
                if (state.isMobile) {
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.width = '';
                }
            }
        };
    }
    if (ui.settingsModal) {
        ui.settingsModal.onclick = (e) => {
            if (e.target === ui.settingsModal) {
                ui.settingsModal.style.display = 'none';
                if (state.isMobile) {
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.width = '';
                }
            }
        };
    }
    
    // 字体选择器（平铺按钮）
    const fontSelectorGrid = document.getElementById('fontSelectorGrid');
    if (fontSelectorGrid) {
        const fontOptions = fontSelectorGrid.querySelectorAll('.font-option');
        fontOptions.forEach(btn => {
            const fontValue = btn.dataset.font;
            if (fontValue === (state.currentFont || 'cursive')) {
                btn.classList.add('active');
            }
            btn.onclick = () => {
                fontOptions.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.currentFont = fontValue;
                // 更新已显示照片的字体
                document.querySelectorAll('.p-text').forEach(el => {
                    el.style.fontFamily = fontValue;
                });
            };
        });
    }
    
    // 相纸纹理开关
    const paperTextureToggle = document.getElementById('paperTextureToggle');
    if (paperTextureToggle) {
        paperTextureToggle.checked = state.paperTexture;
        paperTextureToggle.onchange = (e) => {
            state.paperTexture = e.target.checked;
        };
    }
    
    // 盲盒照片开关
    const mysteryPhotoToggle = document.getElementById('mysteryPhotoToggle');
    if (mysteryPhotoToggle) {
        mysteryPhotoToggle.checked = state.mysteryPhoto;
        mysteryPhotoToggle.onchange = (e) => {
            state.mysteryPhoto = e.target.checked;
        };
    }
    
    // 快门音效开关
    if (ui.shutterSoundToggle) {
        ui.shutterSoundToggle.onchange = (e) => {
            state.shutterSoundEnabled = e.target.checked;
        };
    }
    
    // 主题切换
    if (ui.themeToggle) {
        ui.themeToggle.onchange = (e) => {
            state.lightSkin = !e.target.checked;
            ui.cam.className = state.lightSkin ? 'camera-container skin-light' : 'camera-container skin-dark';
        };
    }
    
    // 移动端照片墙
    if (ui.galleryClose) {
        ui.galleryClose.onclick = () => {
            ui.mobileGallery.style.display = 'none';
            stopGalleryShakeHelper();
        };
    }
    
    if (ui.viewToggle) {
        ui.viewToggle.onclick = () => {
            const cardViewEl = document.getElementById('cardView');
            const isCardView = cardViewEl && cardViewEl.style.display !== 'none';
            if (isCardView) {
                // 切换到网格视图
                stopGalleryShakeHelper();
                if (cardViewEl) cardViewEl.style.display = 'none';
                if (ui.gridView) {
                    ui.gridView.style.display = 'grid';
                    renderGridView();
                }
                ui.viewToggle.textContent = t('cardView');
            } else {
                // 切换到卡片视图
                if (ui.gridView) ui.gridView.style.display = 'none';
                if (cardViewEl) cardViewEl.style.display = 'flex';
                ui.viewToggle.textContent = t('gridView');
            }
        };
    }
    
    // 语言切换事件监听
    window.addEventListener('languagechange', () => {
        updatePageLanguage();
        renderFilters();
        initFrameSelector();
    });
    
    // 相机控制按钮
    if (ui.tmBtn) {
        ui.tmBtn.onclick = () => { 
            state.tm = !state.tm; 
            updateState(); 
        };
    }
    
    if (ui.autoBtn) {
        ui.autoBtn.onclick = () => { 
            state.autoDev = !state.autoDev; 
            updateState(); 
        };
    }
    
    if (ui.skinBtn) {
        ui.skinBtn.onclick = () => {
            state.lightSkin = !state.lightSkin;
            ui.cam.className = state.lightSkin ? 'camera-container skin-light' : 'camera-container skin-dark';
        };
    }
    
    // 快门按钮
    if (ui.shutter) {
        ui.shutter.onclick = () => {
            if (state.isMobile) {
                ensureMotionPermission().catch(() => {});
            }
            // 检查拍照次数限制
            const photoType = state.mysteryPhoto ? 'mystery' : 'normal';
            
            if (PhotoLimitManager.checkLimit(photoType)) {
                showLimitModal(photoType);
                return;
            }
            
            playShutterSound();
            const fl = document.getElementById('flash');
            if (fl) {
                fl.style.opacity = 0.8; 
                setTimeout(() => fl.style.opacity=0, 100);
            }

            let params = { text: ui.input ? ui.input.value : '', frame: state.currentFrame };
            if(state.tm) {
                const era = ERAS[Math.floor(Math.random()*ERAS.length)];
                params.f = era.f; params.year = era.y;
            } else {
                const f = FILTERS[state.filterIdx];
                params.f = f.f; params.rainbow = f.rainbow;
            }
            generate(params);
        };
    }
    
    // 移动端照片墙操作按钮
    if (ui.cardDelete) {
        ui.cardDelete.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // 合并普通照片和盲盒照片（与renderCardView保持一致）
            const allPhotos = [...state.photos];
            state.mysteryPhotos.forEach(mystery => {
                allPhotos.push({
                    ...mystery.photo,
                    isMystery: true,
                    mysteryId: mystery.id,
                    revealTime: mystery.revealTime,
                    revealed: mystery.revealed,
                    timestamp: mystery.createdAt || mystery.photo.timestamp
                });
            });
            
            // 按时间戳排序（最新的在前，与renderCardView保持一致）
            allPhotos.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            
            if (allPhotos.length > 0 && state.currentPhotoIndex < allPhotos.length) {
                const currentPhoto = allPhotos[state.currentPhotoIndex];
                
                if (currentPhoto.isMystery) {
                    // 删除盲盒照片
                    const mysteryId = currentPhoto.mysteryId;
                    const mysteryIndex = state.mysteryPhotos.findIndex(m => m.id === mysteryId);
                    if (mysteryIndex > -1) {
                        state.mysteryPhotos.splice(mysteryIndex, 1);
                        // 更新localStorage
                        try {
                            const stored = JSON.parse(localStorage.getItem('timeframe_mystery') || '[]');
                            const filtered = stored.filter(m => m.id !== mysteryId);
                            localStorage.setItem('timeframe_mystery', JSON.stringify(filtered));
                        } catch (e) {
                            console.error('Failed to remove mystery photo from storage:', e);
                        }
                    }
                    // 删除DOM中的盲盒照片
                    const mysteryCard = document.querySelector(`[data-mystery-id="${mysteryId}"]`);
                    if (mysteryCard) mysteryCard.remove();
                } else {
                    // 删除普通照片
                    const photoIndex = state.photos.findIndex(p => p.timestamp === currentPhoto.timestamp);
                    if (photoIndex > -1) {
                        state.photos.splice(photoIndex, 1);
                        // 更新localStorage
                        removePhotoFromStorage(currentPhoto.timestamp);
                    }
                    // 删除DOM中的普通照片
                    const polaroid = document.querySelector(`[data-photo-id="${currentPhoto.timestamp}"]`);
                    if (polaroid) polaroid.remove();
                }
                
                // 调整索引
                if (state.currentPhotoIndex >= allPhotos.length - 1) {
                    state.currentPhotoIndex = Math.max(0, allPhotos.length - 2);
                }
                
                // 检查是否还有照片
                const remainingPhotos = state.photos.length + state.mysteryPhotos.length;
                if (remainingPhotos === 0) {
                    if (ui.mobileGallery) ui.mobileGallery.style.display = 'none';
                } else {
                    renderCardView().catch(console.error);
                }
            }
        };
    }

    if (ui.cardDownload) {
        ui.cardDownload.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // 合并普通照片和盲盒照片（与renderCardView保持一致）
            const allPhotos = [...state.photos];
            state.mysteryPhotos.forEach(mystery => {
                allPhotos.push({
                    ...mystery.photo,
                    isMystery: true,
                    mysteryId: mystery.id,
                    revealTime: mystery.revealTime,
                    revealed: mystery.revealed,
                    timestamp: mystery.createdAt || mystery.photo.timestamp
                });
            });
            allPhotos.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            
            if (allPhotos.length > 0 && state.currentPhotoIndex < allPhotos.length) {
                const photo = allPhotos[state.currentPhotoIndex];
                
                // 检查是否是未显影照片
                if (photo.revealed === false && !photo.isMystery) {
                    // 未显影照片不能下载
                    return;
                }
                
                // 检查盲盒照片是否到了显影时间
                if (photo.isMystery && !photo.revealed) {
                    const now = Date.now();
                    const timeRemaining = (photo.revealTime || 0) - now;
                    if (timeRemaining > 0) {
                        // 盲盒照片未到显影时间，不能下载
                        return;
                    }
                }
                
                const frameType = photo.params?.frame || state.currentFrame || 'classic';
                // 使用已有的framedSrc，如果没有则重新生成
                let frameSrc = photo.framedSrc || photo.src;
                if (!frameSrc && photo.src) {
                    try {
                        frameSrc = await applyFrame(photo.src, frameType);
                        // 更新photoData，避免重复生成
                        if (photo.isMystery) {
                            const mystery = state.mysteryPhotos.find(m => m.id === photo.mysteryId);
                            if (mystery) {
                                mystery.photo.framedSrc = frameSrc;
                            }
                        } else {
                            const normalPhoto = state.photos.find(p => p.timestamp === photo.timestamp);
                            if (normalPhoto) {
                                normalPhoto.framedSrc = frameSrc;
                            }
                        }
                    } catch (e) {
                        console.error('Failed to apply frame for download:', e);
                        return;
                    }
                }
                if (frameSrc) {
                    try {
                        const dataUrl = await renderPolaroidForDownload(frameSrc, photo.params?.text, photo.params?.year, frameType);
                        await triggerDownload(dataUrl);
                    } catch (e) {
                        console.error('Failed to download photo:', e);
                    }
                }
            }
        };
    }
}

// 语言切换时同步刷新已打开的限次弹窗文案
window.addEventListener('languagechange', () => {
    const limitModal = document.getElementById('limitModal');
    if (!limitModal || limitModal.style.display === 'none') return;
    
    const currentType = limitModal.dataset.photoType || 'normal';
    renderLimitModalCopy(currentType);
});

function updateState() {
    if (ui.tmBtn) ui.tmBtn.className = `toggle-group ${state.tm?'active':''}`;
    if (ui.autoBtn) ui.autoBtn.className = `toggle-group ${state.autoDev?'active':''}`;
    if (ui.filters) {
    Array.from(ui.filters.children).forEach((el,i) => {
        el.classList.toggle('active', !state.tm && i === state.filterIdx);
        el.style.opacity = state.tm ? 0.3 : 1;
    });
    }
    if(state.tm) {
        if (ui.video) ui.video.style.filter = 'grayscale(1) blur(1px)';
        if (ui.rainbow) ui.rainbow.style.display = 'none';
    } else {
        const f = FILTERS[state.filterIdx];
        if (ui.video) ui.video.style.filter = f.rainbow ? 'none' : f.f;
        if (ui.rainbow) ui.rainbow.style.display = f.rainbow ? 'block' : 'none';
    }
}

// 播放快门音效
function playShutterSound() {
    if (!state.shutterSoundEnabled) return;
    const audio = new Audio(SHUTTER_SOUND);
    audio.play().catch(() => {});
}

function generate(p) {
    const ctx = ui.canvas.getContext('2d');
    const size = EXPORT_SIZE; ui.canvas.width = size; ui.canvas.height = size;
    ctx.save(); ctx.translate(size,0); ctx.scale(-1,1);
    if(p.f) ctx.filter = p.f;
    const vw = ui.video.videoWidth, vh = ui.video.videoHeight;
    const min = Math.min(vw, vh);
    ctx.drawImage(ui.video, (vw-min)/2, (vh-min)/2, min, min, 0,0,size,size);
    if(p.rainbow) {
        const g = ctx.createLinearGradient(0,0,size,size);
        g.addColorStop(0,'rgba(255,0,0,0.2)'); g.addColorStop(1,'rgba(0,0,255,0.2)');
        ctx.fillStyle = g; ctx.fillRect(0,0,size,size);
    }
    ctx.restore();
    const photoData = {
        src: ui.canvas.toDataURL(),
        params: p,
        timestamp: Date.now()
    };
    createPolaroid(photoData);
}

// 相纸纹理类（参考文档6.2节）
class PaperTexture {
    static apply(canvas, intensity = 0.15) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // 1. 颗粒感(模拟相纸颗粒)
        for (let i = 0; i < data.length; i += 4) {
            const grain = (Math.random() - 0.5) * intensity * 255;
            data[i] = Math.max(0, Math.min(255, data[i] + grain));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
        }
        
        // 2. 暗角(Vignette)
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
        
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                const vignette = 1 - (distance / maxDistance) * 0.5;
                
                const idx = (y * canvas.width + x) * 4;
                data[idx] *= vignette;
                data[idx + 1] *= vignette;
                data[idx + 2] *= vignette;
            }
        }
        
        // 3. 泛黄(复古感)
        for (let i = 0; i < data.length; i += 4) {
            data[i] += 10;     // R
            data[i + 1] += 5;  // G
            data[i + 2] -= 10; // B
        }
        
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }
}

// 水印类（参考文档6.4节）
class Watermark {
    static add(canvas, options = {}) {
        const ctx = canvas.getContext('2d');
        const {
            text = getWatermarkText(),
            position = 'bottom-right',
            opacity = 0.6,
            fontSize = 14,
            color = '#FFFFFF',
            background = 'rgba(0,0,0,0.5)',
            padding = 8
        } = options;

        ctx.save();
        ctx.font = `${fontSize}px sans-serif`;
        const textWidth = ctx.measureText(text).width;
        const textHeight = fontSize;

        // 计算位置
        let x, y;
        const positions = {
            'top-left': [padding, padding + textHeight],
            'top-right': [canvas.width - textWidth - padding * 2, padding + textHeight],
            'bottom-left': [padding, canvas.height - padding],
            'bottom-right': [canvas.width - textWidth - padding * 2, canvas.height - padding],
            'center': [(canvas.width - textWidth) / 2, canvas.height / 2]
        };
        
        [x, y] = positions[position] || positions['bottom-right'];

        // 背景
        ctx.fillStyle = background;
        ctx.fillRect(x - padding, y - textHeight - padding,
                     textWidth + padding * 2, textHeight + padding * 2);

        // 文字
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.fillText(text, x, y);

        ctx.restore();
        return canvas;
    }
}

// 盲盒照片类（参考文档6.5节）
class MysteryPhoto {
    constructor(photoData) {
        this.photoData = photoData;
        this.revealTime = Date.now() + 24 * 60 * 60 * 1000;  // 24小时
        this.id = `mystery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.save();
    }

    save() {
        const mysteryData = {
            id: this.id,
            photo: this.photoData,
            revealTime: this.revealTime,
            createdAt: Date.now(),
            revealed: false
        };
        
        // 保存到state
        state.mysteryPhotos.push(mysteryData);
        
        // 保存到localStorage
        try {
            const stored = JSON.parse(localStorage.getItem('timeframe_mystery') || '[]');
            stored.push(mysteryData);
            localStorage.setItem('timeframe_mystery', JSON.stringify(stored));
        } catch (e) {
            console.error('Failed to save mystery photo', e);
        }
    }

    static createCard(data) {
        const card = document.createElement('div');
        const now = Date.now();
        const timeRemaining = data.revealTime - now;
        const canReveal = timeRemaining <= 0;
        
        // 设置mystery ID，方便后续查找和更新
        card.dataset.mysteryId = data.id;

        if (canReveal && !data.revealed) {
            // 可揭晓
            card.className = 'mystery-card reveal-ready';
            const cover = document.createElement('div');
            cover.className = 'mystery-cover';
            cover.innerHTML = `
                <div class="mystery-icon">📦</div>
                <p>${typeof t === 'function' ? t('mysteryTapToReveal') : '点击揭晓'}</p>
            `;
            cover.onclick = () => MysteryPhoto.reveal(data.id);
            card.appendChild(cover);
        } else if (data.revealed) {
            // 已揭晓 - 使用与普通照片相同的样式和尺寸
            card.className = 'polaroid';
            const frameType = data.photo.params?.frame || state.currentFrame || 'classic';
            const frame = frameTemplates[frameType] || frameTemplates.classic;
            
            // 应用相框样式
            if (frame.background.includes('gradient')) {
                const gradientMatch = frame.background.match(/linear-gradient\([^)]+\)/);
                if (gradientMatch) {
                    card.style.background = gradientMatch[0];
                } else {
                    card.style.background = '#FFFFFF';
                }
            } else {
                card.style.background = frame.background || '#FFFFFF';
            }
            
            // 应用相纸纹理
            if (state.paperTexture) {
                card.classList.add('has-paper-texture');
            }
            
            // 添加水印（免费用户）
            // 使用与普通照片相同的结构：关闭按钮 + photo-frame
            const framedSrc = data.photo.framedSrc || data.photo.src;
            
            const mysteryAlt = escapeAttributeValue(
                getPhotoAltText(data.photo, { isMystery: true, revealed: true })
            );
            card.innerHTML = `
                <div class="close-btn"><svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></div>
                <div class="photo-frame"><img src="${framedSrc}" alt="${mysteryAlt}" loading="lazy"></div>
            `;
            
            // 等待图片加载完成后再显示
            const img = card.querySelector('img');
            if (img) {
                // 确保图片正确显示
                img.style.opacity = '1';
                img.style.display = 'block';
                img.style.visibility = 'visible';
                img.style.width = '100%';
                img.style.height = 'auto';
                
                if (img.complete) {
                } else {
                    img.onload = () => {
                        // 确保图片显示
                        img.style.opacity = '1';
                        img.style.display = 'block';
                        img.style.visibility = 'visible';
                    };
                    img.onerror = () => {
                        console.error('[MysteryPhoto] Image failed to load', framedSrc);
                    };
                }
            }
            
            // 如果有文字，添加文字
            const params = data.photo.params || {};
            const captionText = (params.text || '').trim();
            const yearText = (params.year || '').trim();
            if (captionText || yearText) {
                const textWrap = document.createElement('div');
                textWrap.className = 'p-text';
                const selectedFont = state.currentFont || frame.font || 'cursive';
                textWrap.style.fontFamily = selectedFont;
                textWrap.style.color = frame.textColor || '#333';
                
                if (captionText) {
                    const span = document.createElement('span');
                    span.textContent = captionText;
                    span.style.color = frame.textColor || '#333';
                    textWrap.appendChild(span);
                }
                if (yearText) {
                    const small = document.createElement('small');
                    small.textContent = yearText;
                    small.style.color = frame.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)';
                    textWrap.appendChild(small);
                }
                card.appendChild(textWrap);
            }
            
            // 双击下载功能
            card.ondblclick = async (e) => {
                e.stopPropagation();
                const dataUrl = await renderPolaroidForDownload(framedSrc, params.text, params.year, frameType);
                await triggerDownload(dataUrl);
                if (!state.isMobile) {
                    const endRot = parseFloat(card.style.transform.match(/rotate\(([^)]+)\)/)?.[1] || '0');
                    card.style.transform = `scale(1.05) rotate(${endRot}deg)`;
                    setTimeout(() => card.style.transform = `scale(1) rotate(${endRot}deg)`, 150);
                }
            };
            
            // 关闭按钮功能
            card.querySelector('.close-btn').onclick = (e) => {
                e.stopPropagation();
                const index = state.mysteryPhotos.findIndex(m => m.id === data.id);
                if (index > -1) {
                    state.mysteryPhotos.splice(index, 1);
                }
                // 更新localStorage
                try {
                    const stored = JSON.parse(localStorage.getItem('timeframe_mystery') || '[]');
                    const filtered = stored.filter(m => m.id !== data.id);
                    localStorage.setItem('timeframe_mystery', JSON.stringify(filtered));
                } catch (e) {
                    console.error('Failed to remove mystery photo', e);
                }
                card.remove();
            };
        } else {
            // 倒计时
            const hours = Math.floor(timeRemaining / 3600000);
            const minutes = Math.floor((timeRemaining % 3600000) / 60000);
            card.className = 'mystery-card locked';
            const developingAlt = typeof t === 'function' ? (t('mysteryDevelopingAlt') || '') : '';
            const countdownText = typeof t === 'function'
                ? t('mysteryDevelopingDesc', { hours, minutes })
                : `照片冲洗中，请耐心等待\n预计${hours}小时${minutes}分钟后冲洗完`;
                const lockedAlt = escapeAttributeValue(developingAlt || getPhotoAltText(data.photo, { isMystery: true, revealed: false }));
                card.innerHTML = `
                    <div class="mystery-locked">
                        <div class="mystery-icon"><img src="./public/images/jiaopian.png" alt="${lockedAlt}" style="height: 48px; width: auto; opacity: 0.6;"></div>
                        <p style="white-space: pre-line; text-align: center;">${countdownText}</p>
                    </div>
                `;
        }

        return card;
    }

    static async reveal(id) {
        const mysteryData = state.mysteryPhotos.find(m => m.id === id);
        if (!mysteryData) return;
        
        mysteryData.revealed = true;
        
        // 更新localStorage
        try {
            const stored = JSON.parse(localStorage.getItem('timeframe_mystery') || '[]');
            const index = stored.findIndex(m => m.id === id);
            if (index > -1) {
                stored[index].revealed = true;
                localStorage.setItem('timeframe_mystery', JSON.stringify(stored));
            }
        } catch (e) {
            console.error('Failed to update mystery photo', e);
        }
        
        // 更新DOM：找到对应的卡片并更新为已揭晓状态
        const existingCard = document.querySelector(`[data-mystery-id="${id}"]`);
        if (existingCard) {
            // 移除旧卡片
            existingCard.remove();
        }
        
        // 重新创建已揭晓的卡片
        const newCard = MysteryPhoto.createCard(mysteryData);
        newCard.className = 'polaroid';
        newCard.dataset.mysteryId = id;
        
        // 桌面端：添加到页面并绑定拖动
        if (!state.isMobile) {
            const endX = Math.random() * (window.innerWidth - 280) + 20;
            const endY = window.innerHeight/2 + Math.random()*(window.innerHeight/3);
            const endRot = (Math.random()-0.5)*30;
            newCard.style.left = endX + 'px';
            newCard.style.top = endY + 'px';
            newCard.style.transform = `scale(1) rotate(${endRot}deg)`;
            newCard.style.position = 'absolute';
            newCard.style.opacity = '1';
            state.zIndex++; newCard.style.zIndex = state.zIndex;
            ui.desk.appendChild(newCard);
            makeDraggable(newCard);
        }
        
        // 播放揭晓动画
        MysteryPhoto.playRevealAnimation(mysteryData.photo.framedSrc || mysteryData.photo.src);
    }

    static playRevealAnimation(photoData) {
        const overlay = document.createElement('div');
        overlay.className = 'mystery-reveal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: black;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const img = document.createElement('img');
        img.src = photoData;
        img.alt = typeof t === 'function' ? (t('mysteryRevealAlt') || 'TimeFrame Photo') : 'TimeFrame Photo';
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            opacity: 0;
            transform: scale(0.8);
            transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        `;

        overlay.appendChild(img);
        document.body.appendChild(overlay);

        setTimeout(() => {
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        }, 100);

        // 触觉反馈
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 200]);
        }

        // 3秒后关闭
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 500);
        }, 3000);
    }
}

// 应用相框（只处理图片本身，不添加边框）
function applyFrame(imageData, frameType) {
    return new Promise((resolve) => {
        const img = new Image();
        
        img.onload = () => {
            // 只处理图片本身，不添加边框
            const canvas = document.createElement('canvas');
            canvas.width = EXPORT_SIZE;
            canvas.height = EXPORT_SIZE;
            const ctx = canvas.getContext('2d');
            
            // 直接绘制图片
            ctx.drawImage(img, 0, 0, EXPORT_SIZE, EXPORT_SIZE);
            
            if (state.watermark) {
                const watermarkLabel = getWatermarkText();
                drawCanvasWatermark(
                    ctx,
                    watermarkLabel,
                    EXPORT_SIZE - 12,
                    EXPORT_SIZE - 10,
                    22
                );
            }
            
            resolve(canvas.toDataURL('image/png'));
        };
        
        img.src = imageData;
    });
}

async function createPolaroid(photoData) {
    const { src, params } = photoData;
    
    // 立即应用相框样式（盲盒照片也需要先应用相框）
    const frameType = params.frame || state.currentFrame || 'classic';
    const framedSrc = await applyFrame(src, frameType);
    photoData.framedSrc = framedSrc;
    
    // 检查是否是盲盒照片
    if (state.mysteryPhoto) {
        // 增加盲盒照片计数
        PhotoLimitManager.increment('mystery');
        
        const mystery = new MysteryPhoto(photoData);
        // 创建盲盒卡片显示
        const mysteryCard = MysteryPhoto.createCard({
            id: mystery.id,
            photo: photoData,
            revealTime: mystery.revealTime,
            revealed: false
        });
        mysteryCard.className = 'polaroid mystery-polaroid';
        
        // 移动端：从底部滑出（Z轴分层架构）
        if (state.isMobile) {
            mysteryCard.style.position = 'fixed';
            mysteryCard.style.left = '50%';
            mysteryCard.style.top = '50%';
            mysteryCard.style.transform = 'translate(-50%, 120vh) rotate(5deg)';
            mysteryCard.style.opacity = '1';
            
            // 添加下滑收起手势
            bindSwipeToDismiss(mysteryCard);
            
            // 触发滑出动画
            requestAnimationFrame(() => {
                mysteryCard.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                mysteryCard.style.transform = 'translate(-50%, -50%) rotate(-2deg)';
            });
        } else {
            // 桌面端：从相机中心飞出
            const camRect = ui.cam.getBoundingClientRect();
            const startX = camRect.left + camRect.width/2 - 125;
            const startY = camRect.top + camRect.height/2 - 150;
            mysteryCard.style.left = startX + 'px';
            mysteryCard.style.top = startY + 'px';
            mysteryCard.style.transform = 'scale(0.2) rotate(0deg)';
            mysteryCard.style.opacity = '0';
            
            const endX = Math.random() * (window.innerWidth - 280) + 20;
            const endY = window.innerHeight/2 + Math.random()*(window.innerHeight/3);
            const endRot = (Math.random()-0.5)*30;
            
            requestAnimationFrame(() => {
                mysteryCard.style.opacity = '1';
                mysteryCard.style.left = endX + 'px';
                mysteryCard.style.top = endY + 'px';
                mysteryCard.style.transform = `scale(1) rotate(${endRot}deg)`;
            });
        }
        
        ui.desk.appendChild(mysteryCard);
        state.zIndex++; mysteryCard.style.zIndex = state.zIndex;
        
        return;
    }
    
    // 增加普通照片计数
    PhotoLimitManager.increment('normal');
    
    const div = document.createElement('div');
    div.className = 'polaroid';
    div.dataset.photoId = photoData.timestamp;
    
    // 存储照片数据（保存原始src和framedSrc）
    photoData.framedSrc = framedSrc;
    // 保存显影状态：如果自动显影关闭，标记为未显影
    photoData.revealed = state.autoDev; // 自动显影开启=true，关闭=false
    state.photos.push(photoData);
    
    // 保存普通照片到localStorage（异步，不阻塞）
    savePhotosToStorage().catch(e => {
        console.error('[PhotoStorage] Failed to save after photo creation:', e);
    });
    
    // 应用相框样式到div（最外围的白色边框）
    const frame = frameTemplates[frameType] || frameTemplates.classic;
    div.dataset.frameType = frameType;
    
    // 设置相框背景色（最外围边框）
    if (frame.background.includes('gradient')) {
        // 渐变背景需要特殊处理
        const gradientMatch = frame.background.match(/linear-gradient\([^)]+\)/);
        if (gradientMatch) {
            div.style.background = gradientMatch[0];
        } else {
            div.style.background = '#FFFFFF'; // 默认白色
        }
    } else {
        div.style.background = frame.background || '#FFFFFF';
    }
    
    // 应用相纸纹理到整个polaroid div（如果启用）
    if (state.paperTexture) {
        div.classList.add('has-paper-texture');
    }
    
    // 移动端：从底部滑出（Z轴分层架构）
    if (state.isMobile) {
        div.style.position = 'fixed';
        div.style.left = '50%';
        div.style.top = '50%';
        div.style.transform = 'translate(-50%, 120vh) rotate(5deg)';
        div.style.opacity = '1';
        
        // 添加下滑收起手势
        bindSwipeToDismiss(div);
        
        // 触发滑出动画
        requestAnimationFrame(() => {
            div.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            div.style.transform = 'translate(-50%, -50%) rotate(-2deg)';
        });
    } else {
        // 桌面端：从相机中心飞出
        const camRect = ui.cam.getBoundingClientRect();
        const startX = camRect.left + camRect.width/2 - 125;
        const startY = camRect.top + camRect.height/2 - 150;
        
        div.style.left = startX + 'px';
        div.style.top = startY + 'px';
        div.style.transform = 'scale(0.2) rotate(0deg)';
        div.style.opacity = '0';

        // 确保照片不会飞出屏幕外
        const photoWidth = 280;
        const photoHeight = 350;
        const padding = 20;
        const maxX = window.innerWidth - photoWidth - padding;
        const maxY = window.innerHeight - photoHeight - padding;
        const minX = padding;
        const minY = padding;
        
        // 计算安全的随机位置
        const safeWidth = Math.max(photoWidth, maxX - minX);
        const safeHeight = Math.max(photoHeight, maxY - minY);
        const endX = Math.max(minX, Math.min(maxX, minX + Math.random() * safeWidth));
        const endY = Math.max(minY, Math.min(maxY, minY + Math.random() * safeHeight));
        const endRot = (Math.random()-0.5)*30;
        
        // 执行飞出动画
        requestAnimationFrame(() => {
            div.style.opacity = '1';
            div.style.left = endX + 'px';
            div.style.top = endY + 'px';
            div.style.transform = `scale(1) rotate(${endRot}deg)`;
            // 确保位置是绝对定位，可以拖动
            div.style.position = 'absolute';
        });
    }

    const photoAlt = escapeAttributeValue(getPhotoAltText(photoData, { isMystery: false, revealed: params.revealed !== false }));
    div.innerHTML = `
        <div class="close-btn"><svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg></div>
        <div class="photo-frame"><img src="${framedSrc}" alt="${photoAlt}" loading="lazy"></div>
    `;

    const photoFrameEl = div.querySelector('.photo-frame');
    if (!state.autoDev && photoFrameEl) {
        const overlay = document.createElement('div');
        overlay.className = 'develop-overlay';
        overlay.innerHTML = `
            <div style="font-size:30px">${t('developHintEmoji')}</div>
            <div style="font-size:12px;margin-top:5px">${t('developHint')}</div>
        `;
        photoFrameEl.appendChild(overlay);
    }

    const captionText = (params.text || '').trim();
    const yearText = (params.year || '').trim();
    if(captionText || yearText) {
        const textWrap = document.createElement('div');
        textWrap.className = 'p-text';
        // 应用用户选择的字体
        const selectedFont = state.currentFont || frame.font || 'cursive';
        textWrap.style.fontFamily = selectedFont;
        // 应用相框的文字颜色
        textWrap.style.color = frame.textColor || '#333';
        
        if(captionText) {
            const span = document.createElement('span');
            span.textContent = captionText;
            span.style.color = frame.textColor || '#333';
            textWrap.appendChild(span);
        }
        if(yearText) {
            const small = document.createElement('small');
            small.textContent = yearText;
            // 年份颜色：深色背景用半透明白，浅色背景用半透明黑
            small.style.color = frame.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)';
            textWrap.appendChild(small);
        }
        div.appendChild(textWrap);
    }
    
    // 双击下载 - 使用已经应用相框的framedSrc
    div.ondblclick = async (e) => {
        e.stopPropagation();
        // 直接使用framedSrc，确保预览和下载一致
        const dataUrl = await renderPolaroidForDownload(framedSrc, params.text, params.year, frameType);
        await triggerDownload(dataUrl);
        if (!state.isMobile) {
            const endRot = parseFloat(div.style.transform.match(/rotate\(([^)]+)\)/)?.[1] || '0');
            div.style.transform = `scale(1.05) rotate(${endRot}deg)`;
            setTimeout(() => div.style.transform = `scale(1) rotate(${endRot}deg)`, 150);
        }
    };

    div.querySelector('.close-btn').onclick = (e) => { 
        e.stopPropagation(); 
        const index = state.photos.findIndex(p => p.timestamp === photoData.timestamp);
        if (index > -1) state.photos.splice(index, 1);
        // 更新localStorage
        savePhotosToStorage().catch(e => console.error('[PhotoStorage] Failed to save after delete:', e));
        div.remove();
        if (state.isMobile) updateMobileGallery();
    };
    
    ui.desk.appendChild(div);
    state.zIndex++; div.style.zIndex = state.zIndex;

    // 显影逻辑
    const img = div.querySelector('img');
    
    // 显影处理
    if(state.autoDev) {
        // 自动显影：直接显示并绑定拖动功能
        setTimeout(() => {
            img.style.opacity = '1';
        }, 800);
        // 桌面端绑定拖动功能
        if (!state.isMobile) {
            makeDraggable(div);
        }
    } else {
        // 手动显影：等待图片加载完成后再设置样式和绑定功能
        const setupManualReveal = () => {
            // 设置模糊样式（ShakeToReveal.init() 会再次设置，确保一致）
            img.style.filter = 'blur(20px) brightness(1.5)';
            img.style.opacity = '0.3';
            img.style.transition = 'all 0.3s ease-out';
            
            // 绑定摇动显影功能（ShakeToReveal.init() 会设置样式）
            new ShakeToReveal(img, 10);
            
            // 桌面端立即绑定拖动功能，让用户能够拖动照片来晃动
            if (!state.isMobile) {
                makeDraggable(div);
            }
            
            // 监听显影完成事件，更新照片数据
            img.addEventListener('revealComplete', () => {
                // 更新照片数据
                const photo = state.photos.find(p => p.timestamp === photoData.timestamp);
                if (photo) {
                    photo.revealed = true;
                    savePhotosToStorage().catch(e => console.error('[PhotoStorage] Failed to save reveal state:', e));
                }
            }, { once: true });
        };
        
        // 等待图片加载完成
        if (img.complete) {
            setupManualReveal();
        } else {
            img.onload = setupManualReveal;
            img.onerror = setupManualReveal; // 即使加载失败也要处理
        }
    }
    
    // 移动端处理
    if (state.isMobile) {
        // 移动端：已经绑定了下滑收起手势，不需要点击进入照片墙
        // 双击可以下载
        div.ondblclick = async (e) => {
            e.stopPropagation();
            const dataUrl = await renderPolaroidForDownload(framedSrc, params.text, params.year, frameType);
            await triggerDownload(dataUrl);
        };
    }
    
    if (state.isMobile) {
        updateMobileGallery();
    }
}

// 移动端下滑收起手势（参考文档）
function bindSwipeToDismiss(card) {
    let startY = 0;
    let isDragging = false;
    
    card.addEventListener('touchstart', (e) => {
        if (e.target.closest('.close-btn')) return;
        startY = e.touches[0].clientY;
        isDragging = true;
        card.classList.add('swiping');
    }, { passive: true });
    
    card.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const deltaY = e.touches[0].clientY - startY;
        
        // 只响应下滑
        if (deltaY > 0) {
            const currentTransform = card.style.transform.match(/translate\([^)]+\)/);
            const baseTransform = currentTransform ? currentTransform[0] : 'translate(-50%, -50%)';
            card.style.transform = `${baseTransform} translateY(${deltaY}px)`;
        }
    }, { passive: true });
    
    card.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('swiping');
        
        const deltaY = e.changedTouches[0].clientY - startY;
        
        // 下滑超过150px，只收起照片，不删除（照片数据保留在state.photos中，照片墙可以查看）
        if (deltaY > 150) {
            card.style.transition = 'transform 0.4s ease-out, opacity 0.4s';
            card.style.transform = 'translate(-50%, 120vh) rotate(5deg)';
            card.style.opacity = '0';
            
            setTimeout(() => {
                // 只隐藏DOM元素，不删除state.photos中的数据
                card.style.display = 'none';
                // 标记为已隐藏（可选，用于后续可能需要恢复显示）
                card.dataset.hidden = 'true';
                // 照片隐藏后，更新移动端照片墙，显示浮动按钮
                if (state.isMobile) {
                    updateMobileGallery();
                }
            }, 400);
        } else {
            // 否则回弹
            card.style.transition = '';
            card.style.transform = 'translate(-50%, -50%) rotate(-2deg)';
        }
    });
}

function makeDraggable(el) {
    // 如果已经绑定过拖动功能，先移除旧的事件监听器
    if (el._dragHandlers) {
        el.removeEventListener('mousedown', el._dragHandlers.mousedown);
        el.removeEventListener('touchstart', el._dragHandlers.touchstart, { passive: false });
        el.removeEventListener('touchmove', el._dragHandlers.touchmove, { passive: false });
        el.removeEventListener('touchend', el._dragHandlers.touchend);
        el.removeEventListener('touchcancel', el._dragHandlers.touchend);
    }
    
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;
    
    // 确保元素有绝对定位
    if (el.style.position !== 'absolute' && el.style.position !== 'fixed') {
        el.style.position = 'absolute';
    }
    
    // 鼠标事件处理（桌面端）
    const handleMouseDown = (e) => {
        // 只处理鼠标左键
        if (e.button !== undefined && e.button !== 0) return;
        
        // 忽略关闭按钮和显影提示
        if (e.target.closest('.close-btn')) return;
        if (e.target.closest('.develop-overlay')) return;
        
        // 如果点击的是图片且照片未显影，允许拖动但不要阻止事件传播
        // 这样用户可以通过拖动照片来晃动，同时 ShakeToReveal 也能检测到晃动
        const img = el.querySelector('img');
        const photoId = el.dataset.photoId;
        let isUnrevealed = false;
        if (photoId) {
            const photo = state.photos.find(p => p.timestamp === parseInt(photoId));
            if (photo && !photo.revealed) {
                isUnrevealed = true;
            }
        }
        
        // 如果点击的是图片且照片未显影，不设置 dragging 标记，让 ShakeToReveal 也能工作
        if (img && (e.target === img || img.contains(e.target)) && isUnrevealed) {
            // 不设置 dragging 标记，不阻止事件传播
            // 但仍然允许拖动，只是不标记为拖动状态，这样 ShakeToReveal 可以检测晃动
            // 注意：这里不 return，继续执行拖动逻辑，但不设置 dragging 标记
        }
        
        // 标记为拖动状态（未显影照片不设置，让 ShakeToReveal 能检测晃动）
        if (!isUnrevealed) {
            el.dataset.dragging = 'true';
        }
        isDragging = true;
        
        
        // 提升层级
        state.zIndex++;
        el.style.zIndex = state.zIndex;
        
        // 获取起始位置
        startX = e.clientX;
        startY = e.clientY;
        
        // 获取元素当前位置
        const rect = el.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        
        // 禁用过渡动画
        el.style.transition = 'none';
        
        // 未显影照片不阻止事件传播，让 ShakeToReveal 也能接收事件
        if (isUnrevealed) {
            // 不阻止事件传播，让 ShakeToReveal 能够检测晃动
            // 但仍然允许拖动照片
        } else {
            // 已显影照片正常阻止事件传播
            e.preventDefault();
            e.stopPropagation();
        }
        
        // 添加全局事件监听器
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };
    
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        
        // 计算移动距离
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        // 计算新位置
        let newX = initialX + deltaX;
        let newY = initialY + deltaY;
        
        // 限制在屏幕内
        const rect = el.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        // 更新位置
        el.style.left = newX + 'px';
        el.style.top = newY + 'px';
        
        // 保留旋转角度
        const currentRot = el.style.transform.match(/rotate\(([^)]+)\)/);
        if (currentRot) {
            el.style.transform = `rotate(${currentRot[1]})`;
        }
        
        // 阻止默认行为和事件冒泡
        e.preventDefault();
        e.stopPropagation();
    };
    
    const handleMouseUp = (e) => {
        if (!isDragging) return;
        
        isDragging = false;
        el.style.transition = 'transform 0.1s';
        
        // 延迟清除标记
        setTimeout(() => {
            delete el.dataset.dragging;
        }, 100);
        
        // 移除全局事件监听器
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };
    
    // 触摸事件处理（移动端）
    const handleTouchStart = (e) => {
        // 忽略关闭按钮和显影提示
        if (e.target.closest('.close-btn')) return;
        if (e.target.closest('.develop-overlay')) return;
        
        // 如果是照片墙按钮，特殊处理
        if (el.id === 'galleryBtn' && e.target.tagName === 'IMG') {
            return;
        }
        
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            // 标记为拖动状态
            el.dataset.dragging = 'true';
            isDragging = true;
            
            // 提升层级
            state.zIndex++;
            el.style.zIndex = state.zIndex;
            
            // 获取起始位置
            startX = touch.clientX;
            startY = touch.clientY;
            
            // 获取元素当前位置
            const rect = el.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            // 禁用过渡动画
            el.style.transition = 'none';
        }
    };
    
    const handleTouchMove = (e) => {
        if (!isDragging || e.touches.length === 0) return;
        
        const touch = e.touches[0];
        
        // 计算移动距离
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        
        // 计算新位置
        let newX = initialX + deltaX;
        let newY = initialY + deltaY;
        
        // 限制在屏幕内
        const rect = el.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        // 更新位置
        el.style.left = newX + 'px';
        el.style.top = newY + 'px';
        el.style.right = 'auto';
        el.style.bottom = 'auto';
        
        // 保留旋转角度
        const currentRot = el.style.transform.match(/rotate\(([^)]+)\)/);
        if (currentRot) {
            el.style.transform = `rotate(${currentRot[1]})`;
        }
        
        e.preventDefault();
    };
    
    const handleTouchEnd = () => {
        if (!isDragging) return;
        
        isDragging = false;
        el.style.transition = 'transform 0.2s';
        
        // 延迟清除标记
        setTimeout(() => {
            delete el.dataset.dragging;
        }, 100);
    };
    
    // 绑定鼠标事件（桌面端）
    el.addEventListener('mousedown', handleMouseDown);
    
    // 绑定触摸事件（移动端）
    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);
    el.addEventListener('touchcancel', handleTouchEnd);
    
    // 保存引用以便后续清理（如果需要）
    el._dragHandlers = {
        mousedown: handleMouseDown,
        mousemove: handleMouseMove,
        mouseup: handleMouseUp,
        touchstart: handleTouchStart,
        touchmove: handleTouchMove,
        touchend: handleTouchEnd
    };
}

function renderPolaroidForDownload(photoSrc, caption, year, frameType) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const frame = frameTemplates[frameType] || frameTemplates.classic;
            const padding = frame.padding;
            const photoSize = EXPORT_SIZE;
            // 相框宽度 = 照片 + 左右内边距
            const frameWidth = photoSize + padding.left + padding.right;
            // 相框高度 = 照片 + 上下内边距 + 文字区域（减少高度，让文字更靠上）
            const downloadTextAreaHeight = 80; // 减少文字区域高度，让文字更靠上
            const frameHeight = photoSize + padding.top + padding.bottom + downloadTextAreaHeight;

            const canvas = document.createElement('canvas');
            canvas.width = frameWidth;
            canvas.height = frameHeight;
            const ctx = canvas.getContext('2d');

            // 绘制相框背景（最外围边框）
            if (frame.background.includes('gradient')) {
                // 处理渐变背景 - 解析CSS渐变并转换为Canvas渐变
                const gradientMatch = frame.background.match(/linear-gradient\((\d+)deg,\s*([^,]+)\s+(\d+)%,\s*([^)]+)\s+(\d+)%\)/);
                if (gradientMatch) {
                    const angle = parseInt(gradientMatch[1]);
                    const color1 = gradientMatch[2].trim();
                    const color2 = gradientMatch[4].trim();
                    
                    // 根据角度创建渐变
                    let gradient;
                    if (angle === 180 || angle === 0) {
                        // 垂直渐变
                        gradient = ctx.createLinearGradient(0, 0, 0, frameHeight);
                    } else if (angle === 135 || angle === 45) {
                        // 对角线渐变
                        gradient = ctx.createLinearGradient(0, 0, frameWidth, frameHeight);
                    } else {
                        // 默认垂直渐变
                        gradient = ctx.createLinearGradient(0, 0, 0, frameHeight);
                    }
                    
                    gradient.addColorStop(0, color1);
                    gradient.addColorStop(1, color2);
                    ctx.fillStyle = gradient;
                } else {
                    // 如果解析失败，尝试提取颜色
                    const colorMatch = frame.background.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/);
                    ctx.fillStyle = colorMatch ? colorMatch[0] : '#FFFFFF';
                }
            } else {
                ctx.fillStyle = frame.background || '#FFFFFF';
            }
            ctx.fillRect(0, 0, frameWidth, frameHeight);

            // 绘制照片（照片已经处理过，直接绘制）
            ctx.drawImage(img, padding.left, padding.top, photoSize, photoSize);

            // 绘制文字 - 使用用户选择的字体（在照片下方，不压盖照片）
            const trimmedText = (caption || '').trim().slice(0, 20);
            const displayYear = (year || '').trim();
            const textAreaTop = padding.top + photoSize + padding.bottom; // 文字区域在照片下方
            // 调整文字位置，让文字更靠上（减少偏移量）
            const textAreaCenter = textAreaTop + downloadTextAreaHeight * 0.35; // 从0.5改为0.35，让文字更靠上

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // 使用用户选择的字体
            const selectedFont = state.currentFont || frame.font || 'cursive';

            if (trimmedText && displayYear) {
                // 同时有文字和年份：文字在上，年份在下
                // 文字只比年份大一点：年份是 photoSize/16，文字是 photoSize/14
                const captionFont = Math.floor(photoSize / 14);
                const yearFont = Math.floor(photoSize / 16);
                const spacing = 12; // 间距
                const totalHeight = captionFont + spacing + yearFont;
                const startY = textAreaCenter - totalHeight / 2;

                // 绘制文字（使用选择的字体）
                ctx.font = `${captionFont}px ${selectedFont}`;
                ctx.fillStyle = frame.textColor || '#333';
                ctx.fillText(trimmedText, frameWidth / 2, startY + captionFont / 2);

                // 绘制年份（使用等宽字体）
                ctx.font = `${yearFont}px monospace`;
                ctx.fillStyle = frame.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)';
                ctx.fillText(displayYear, frameWidth / 2, startY + captionFont + spacing + yearFont / 2);
            } else if (trimmedText) {
                // 只有文字
                const captionFont = Math.floor(photoSize / 14);
                ctx.font = `${captionFont}px ${selectedFont}`;
                ctx.fillStyle = frame.textColor || '#333';
                ctx.fillText(trimmedText, frameWidth / 2, textAreaCenter);
            } else if (displayYear) {
                // 只有年份
                const yearFont = Math.floor(photoSize / 16);
                ctx.font = `${yearFont}px monospace`;
                ctx.fillStyle = frame.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)';
                ctx.fillText(displayYear, frameWidth / 2, textAreaCenter);
            }
            
            // 水印已在applyFrame中添加（小字体22px），这里不再重复添加

            resolve(canvas.toDataURL('image/png'));
        };
        img.src = photoSrc;
    });
}

// 移动端照片墙功能
function showMobileGalleryButton() {
    // 合并普通照片和盲盒照片，只要有照片就显示按钮
    const totalPhotos = state.photos.length + state.mysteryPhotos.length;
    if (totalPhotos > 0) {
        let btn = document.getElementById('galleryBtn');
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'galleryBtn';
            btn.className = 'gallery-entry-btn';
            btn.innerHTML = '<img src="./public/images/pic.png" alt="照片墙" style="width:32px;height:32px;pointer-events:none;">';
            // 整个按钮都可以点击
            btn.onclick = (e) => {
                e.stopPropagation();
                showMobileGallery();
            };
            document.body.appendChild(btn);
            
            // 使按钮可拖动
            makeDraggable(btn);
        } else {
            // 如果按钮已存在，确保显示
            btn.style.display = 'flex';
        }
    } else {
        // 如果没有照片，隐藏按钮
        const btn = document.getElementById('galleryBtn');
        if (btn) {
            btn.style.display = 'none';
        }
    }
}


function showMobileGallery() {
    if (!ui.mobileGallery) return;
    if (state.isMobile) {
        ensureMotionPermission().catch(() => {});
    }
    ui.mobileGallery.style.display = 'flex';
    renderCardView().catch(console.error);
}

async function renderCardView() {
    if (!ui.cardContainer) return;
    ui.cardContainer.innerHTML = '';
    stopGalleryShakeHelper();
    
    // 合并普通照片和盲盒照片
    const allPhotos = [...state.photos];
    // 将盲盒照片也加入列表（标记为盲盒类型）
    state.mysteryPhotos.forEach(mystery => {
        allPhotos.push({
            ...mystery.photo,
            isMystery: true,
            mysteryId: mystery.id,
            revealTime: mystery.revealTime,
            revealed: mystery.revealed,
            timestamp: mystery.createdAt || mystery.photo.timestamp
        });
    });
    
    // 按时间戳排序（最新的在前）
    allPhotos.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    if (allPhotos.length === 0) {
        ui.cardContainer.innerHTML = `<div class="no-photos">${t('noPhotos')}</div>`;
        return;
    }
    
    // 确保索引有效
    if (state.currentPhotoIndex >= allPhotos.length) {
        state.currentPhotoIndex = allPhotos.length - 1;
    }
    if (state.currentPhotoIndex < 0) {
        state.currentPhotoIndex = 0;
    }
    
    const currentPhoto = allPhotos[state.currentPhotoIndex] || allPhotos[0];
    const card = await createMobileCard(currentPhoto, allPhotos.length);
    ui.cardContainer.appendChild(card);
    
    // 保存当前所有照片列表，用于滑动切换
    card.dataset.allPhotosCount = allPhotos.length;
    card.dataset.currentIndex = state.currentPhotoIndex;
    
    // 添加滑动事件
    let startX = 0;
    card.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    card.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        const allCount = parseInt(card.dataset.allPhotosCount || allPhotos.length);
        if (Math.abs(diff) > 50) {
            if (diff > 0 && state.currentPhotoIndex < allCount - 1) {
                state.currentPhotoIndex++;
            } else if (diff < 0 && state.currentPhotoIndex > 0) {
                state.currentPhotoIndex--;
            }
            renderCardView().catch(console.error);
        }
    });
}

async function createMobileCard(photoData, totalCount) {
    const card = document.createElement('div');
    card.className = 'mobile-card';
    
    // 检查是否是盲盒照片
    const isMystery = photoData.isMystery === true;
    
    // 检查是否是未显影照片
    let isUnrevealed = false;
    let isMysteryLocked = false;
    let mysteryTimeRemaining = 0;
    
    if (isMystery) {
        // 盲盒照片：检查是否已显影
        const now = Date.now();
        const timeRemaining = (photoData.revealTime || 0) - now;
        isMysteryLocked = !photoData.revealed && timeRemaining > 0;
        mysteryTimeRemaining = timeRemaining;
        isUnrevealed = !photoData.revealed;
    } else {
        // 普通照片：检查显影状态
        isUnrevealed = photoData.revealed === false;
    }
    
    // 数字显示在照片外（在card-info中，不在相框内）
    const pageInfo = `${state.currentPhotoIndex + 1} / ${totalCount || state.photos.length}`;
    
    // 如果是未显影照片（盲盒或普通），显示锁定状态
    if (isUnrevealed) {
        let lockContent = '';
        let clickable = false;
        if (isMysteryLocked) {
            const hours = Math.floor(mysteryTimeRemaining / 3600000);
            const minutes = Math.floor((mysteryTimeRemaining % 3600000) / 60000);
            const developingAlt = typeof t === 'function' ? (t('mysteryDevelopingAlt') || '') : '';
            const countdownText = typeof t === 'function'
                ? t('mysteryDevelopingDesc', { hours, minutes })
                : `照片冲洗中，请耐心等待\n预计${hours}小时${minutes}分钟后冲洗完`;
            lockContent = `
                <div style="margin-bottom: 12px; opacity: 0.6;"><img src="./public/images/jiaopian.png" alt="${developingAlt}" style="height: 48px; width: auto;"></div>
                <p style="font-size: 14px; margin: 0; white-space: pre-line; text-align: center;">${countdownText}</p>
            `;
        } else if (isMystery) {
            // 盲盒照片可以揭晓
            clickable = true;
            lockContent = `
                <div style="font-size: 48px; margin-bottom: 12px; opacity: 0.6;">📦</div>
                <p style="font-size: 14px; margin: 0;">${typeof t === 'function' ? t('mysteryTapToReveal') : '点击揭晓'}</p>
            `;
        } else {
            // 普通照片未显影
            const initialProgress = typeof t === 'function'
                ? t('shakeProgress', { current: 0, total: 10 })
                : '0 / 10';
            lockContent = `
                <div style="font-size: 48px; margin-bottom: 12px; opacity: 0.6;">${t('developHintEmoji')}</div>
                <p style="font-size: 14px; margin: 0;">${t('developHint')}</p>
                <p class="shake-progress" style="margin-top: 8px; font-size: 12px; color: #bbb;">${initialProgress}</p>
                <small style="margin-top: 4px; font-size: 11px; color: #888;">${t('shakeTip')}</small>
            `;
        }
        
        const lockDiv = document.createElement('div');
        lockDiv.className = 'mystery-locked';
        lockDiv.style.cssText = 'width: 100%; aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); color: #999; border-radius: 4px;';
        if (clickable) {
            lockDiv.style.cursor = 'pointer';
            lockDiv.onclick = () => {
                if (photoData.mysteryId) {
                    MysteryPhoto.reveal(photoData.mysteryId);
                    // 刷新照片墙
                    renderCardView().catch(console.error);
                }
            };
        }
        lockDiv.innerHTML = lockContent;
        
        card.innerHTML = `
            <div class="card-photo"></div>
            <div class="card-info">
                <p>${pageInfo}</p>
            </div>
        `;
        card.querySelector('.card-photo').appendChild(lockDiv);
        
        // 如果是未显影的普通照片，绑定摇动显影功能
        if (!isMystery && isUnrevealed && photoData.src) {
            const totalShakes = 10;
            const progressEl = lockDiv.querySelector('.shake-progress');
            const updateProgress = (current) => {
                if (!progressEl) return;
                if (typeof t === 'function') {
                    progressEl.textContent = t('shakeProgress', { current, total: totalShakes });
                } else {
                    progressEl.textContent = `${current}/${totalShakes}`;
                }
            };
            updateProgress(0);
            
            stopGalleryShakeHelper();
            galleryShakeHelper = new GalleryShakeHelper({
                target: lockDiv,
                requiredShakes: totalShakes,
                onProgress: (current) => updateProgress(Math.min(current, totalShakes)),
                onComplete: () => {
                    const photo = state.photos.find(p => p.timestamp === photoData.timestamp);
                    if (photo) {
                        photo.revealed = true;
                        savePhotosToStorage().catch(e => console.error('[PhotoStorage] Failed to save reveal state:', e));
                    }
                    renderCardView().catch(console.error);
                }
            });
        }
        
        return card;
    }
    
    // 已显影照片，正常显示
    // 确保使用framedSrc（带相框的照片），如果没有则重新生成
    const frameType = photoData.params?.frame || state.currentFrame || 'classic';
    let photoSrc = photoData.framedSrc || photoData.src;
    
    // 如果framedSrc不存在，重新生成
    if (!photoData.framedSrc && photoData.src) {
        try {
            photoSrc = await applyFrame(photoData.src, frameType);
            // 更新photoData，避免重复生成
            photoData.framedSrc = photoSrc;
        } catch (e) {
            console.error('Failed to apply frame:', e);
            photoSrc = photoData.src; // 降级使用原始照片
        }
    }
    
    if (!photoSrc) {
        console.error('No photo source available');
        return card; // 返回空卡片
    }
    
    const frame = frameTemplates[frameType] || frameTemplates.classic;
    
    // 生成完整的带相框照片（包括背景、padding、文字等）
    let fullFrameSrc;
    try {
        fullFrameSrc = await renderPolaroidForDownload(photoSrc, photoData.params?.text, photoData.params?.year, frameType);
    } catch (e) {
        console.error('Failed to render full frame:', e);
        fullFrameSrc = photoSrc; // 降级使用framedSrc
    }
    
    const photoAlt = escapeAttributeValue(
        getPhotoAltText(photoData, { isMystery, revealed: !isUnrevealed })
    );
    
    card.innerHTML = `
        <div class="card-photo">
            <img src="${fullFrameSrc}" alt="${photoAlt}" class="card-photo-img" loading="lazy">
        </div>
        <div class="card-info">
            <p>${pageInfo}</p>
        </div>
    `;
    
    // 如果是未显影照片，绑定摇动显影功能
    if (isUnrevealed && !isMystery) {
        const img = card.querySelector('img');
        if (img) {
            // 等待图片加载完成
            const setupShakeReveal = () => {
                // 设置未显影样式
                img.style.filter = 'blur(20px) brightness(1.5)';
                img.style.opacity = '0.3';
                img.style.transition = 'all 0.3s ease-out';
                
                // 绑定摇动显影功能
                const shakeToReveal = new ShakeToReveal(img, 10);
                
                // 监听显影完成事件，更新显示
                img.addEventListener('revealComplete', () => {
                    // 更新照片数据
                    if (photoData.timestamp) {
                        const photo = state.photos.find(p => p.timestamp === photoData.timestamp);
                        if (photo) {
                            photo.revealed = true;
                            savePhotosToStorage().catch(e => console.error('[PhotoStorage] Failed to save reveal state:', e));
                        }
                    }
                    // 重新渲染当前照片
                    renderCardView().catch(console.error);
                }, { once: true });
            };
            
            if (img.complete) {
                setupShakeReveal();
            } else {
                img.onload = setupShakeReveal;
                img.onerror = setupShakeReveal;
            }
        }
    }
    
    return card;
}

function renderGridView() {
    if (!ui.gridView) return;
    ui.gridView.innerHTML = '';
    
    // 合并普通照片和盲盒照片
    const allPhotos = [...state.photos];
    // 将盲盒照片也加入列表（标记为盲盒类型）
    state.mysteryPhotos.forEach(mystery => {
        allPhotos.push({
            ...mystery.photo,
            isMystery: true,
            mysteryId: mystery.id,
            revealTime: mystery.revealTime,
            revealed: mystery.revealed,
            timestamp: mystery.createdAt || mystery.photo.timestamp
        });
    });
    
    // 按时间戳排序（最新的在前）
    allPhotos.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    allPhotos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'grid-item';
        
        // 检查是否是未显影照片
        const isMystery = photo.isMystery === true;
        let isUnrevealed = false;
        let isMysteryLocked = false;
        let mysteryTimeRemaining = 0;
        
        if (isMystery) {
            const now = Date.now();
            const timeRemaining = (photo.revealTime || 0) - now;
            isMysteryLocked = !photo.revealed && timeRemaining > 0;
            mysteryTimeRemaining = timeRemaining;
            isUnrevealed = !photo.revealed;
        } else {
            isUnrevealed = photo.revealed === false;
        }
        
        // 如果是未显影照片，显示锁定图标
        if (isUnrevealed) {
            // 盲盒照片统一使用jiaopian.png图标
            if (isMystery) {
                item.innerHTML = `
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);">
                        <img src="./public/images/jiaopian.png" alt="盲盒照片" style="width: 60%; height: 60%; object-fit: contain; opacity: 0.6;">
                    </div>
                `;
            } else {
                // 普通未显影照片使用emoji
                const lockIcon = t('developHintEmoji');
                item.innerHTML = `
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%); color: #999; font-size: 32px; opacity: 0.6;">
                        ${lockIcon}
                    </div>
                `;
            }
        } else {
            // 已显影照片，正常显示
            const photoSrc = photo.framedSrc || photo.src;
            const gridAlt = escapeAttributeValue(
                getPhotoAltText(photo, { isMystery, revealed: !isUnrevealed })
            );
            item.innerHTML = `<img src="${photoSrc}" alt="${gridAlt}" loading="lazy">`;
        }
        
        item.onclick = () => {
            state.currentPhotoIndex = index;
            if (ui.gridView) ui.gridView.style.display = 'none';
            const cardViewEl = document.getElementById('cardView');
            if (cardViewEl) cardViewEl.style.display = 'flex';
            renderCardView();
            if (ui.viewToggle) ui.viewToggle.textContent = t('gridView');
        };
        ui.gridView.appendChild(item);
    });
}

function updateMobileGallery() {
    // 合并普通照片和盲盒照片，只要有照片就显示按钮
    const totalPhotos = state.photos.length + state.mysteryPhotos.length;
    if (state.isMobile && totalPhotos > 0) {
        showMobileGalleryButton();
    }
}

// 测试工具对象（暴露到全局，方便调试）
window.TimeFrameTestTools = {
    // 启用测试模式
    enableTestMode() {
        localStorage.setItem('timeframe_test_mode', 'true');
        console.log('%c🧪 测试模式已启用', 'color: #00ff00; font-size: 16px; font-weight: bold;');
        location.reload();
    },
    
    // 禁用测试模式
    disableTestMode() {
        localStorage.removeItem('timeframe_test_mode');
        console.log('%c✅ 测试模式已禁用', 'color: #ff9900; font-size: 16px; font-weight: bold;');
        location.reload();
    },
    
    // 清除所有照片
    clearAllPhotos() {
        state.photos = [];
        state.mysteryPhotos = [];
        localStorage.removeItem('timeframe_photos');
        // 修复：使用正确的localStorage键名
        localStorage.removeItem('timeframe_mystery');
        localStorage.removeItem('timeframe_mystery_photos'); // 兼容旧版本
        // 清除DOM中的照片
        document.querySelectorAll('.polaroid, .mystery-polaroid, .mystery-card').forEach(el => el.remove());
        console.log('✅ 已清除所有照片（包括盲盒照片）');
    },
    
    // 清除拍照限制
    clearLimits() {
        PhotoLimitManager.clearAllLimits();
        console.log('✅ 已清除拍照限制');
    },
    
    // 手动保存照片
    async savePhotos() {
        await savePhotosToStorage();
        console.log('✅ 照片已保存');
    },
    
    // 手动加载照片
    loadPhotos() {
        loadPhotosFromStorage();
        loadMysteryPhotos();
        console.log('✅ 照片已加载');
    },
    
    // 查看存储状态
    checkStorage() {
        const storedPhotos = JSON.parse(localStorage.getItem('timeframe_photos') || '[]');
        // 修复：使用正确的localStorage键名，兼容旧版本
        const storedMystery = JSON.parse(localStorage.getItem('timeframe_mystery') || localStorage.getItem('timeframe_mystery_photos') || '[]');
        const isTestMode = PhotoLimitManager.isTestMode();
        
        console.log('📊 存储状态检查:');
        console.log(`  内存中的普通照片: ${state.photos.length}`);
        console.log(`  内存中的盲盒照片: ${state.mysteryPhotos.length}`);
        console.log(`  localStorage中的普通照片: ${storedPhotos.length}`);
        console.log(`  localStorage中的盲盒照片: ${storedMystery.length}`);
        console.log(`  测试模式: ${isTestMode ? '✅ 已启用' : '❌ 未启用'}`);
        
        // 数据一致性检查
        if (state.photos.length !== storedPhotos.length) {
            console.warn('⚠️ 普通照片数量不一致！');
        }
        if (state.mysteryPhotos.length !== storedMystery.length) {
            console.warn('⚠️ 盲盒照片数量不一致！');
        }
        
        // 检查拍照限制
        const normalRemaining = PhotoLimitManager.getRemaining('normal');
        const mysteryRemaining = PhotoLimitManager.getRemaining('mystery');
        const revealRemaining = PhotoLimitManager.getRemaining('reveal');
        console.log(`  普通照片剩余: ${normalRemaining === Infinity ? '∞ (测试模式)' : normalRemaining}`);
        console.log(`  盲盒照片剩余: ${mysteryRemaining === Infinity ? '∞ (测试模式)' : mysteryRemaining}`);
        console.log(`  摇一摇显影剩余: ${revealRemaining === Infinity ? '∞ (测试模式)' : revealRemaining}`);
    }
};

// 等待DOM加载完成
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
