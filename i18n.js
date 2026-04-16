// 多语言配置
const i18n = {
    zh: {
        // 品牌
        brand: '时光相框',
        brandEn: 'TimeFrame',
        slogan: '摇出你的时光',
        sloganEn: 'Shake Your Moments',
        
        // 相机界面
        captionPlaceholder: '写下此刻的心情...',
        timeMachine: '时光机',
        autoDevelop: '自动显影',
        manualDevelop: '手动显影',
        
        // 滤镜名称
        filters: {
            original: '原片',
            blackwhite: '黑白',
            red: '赤红',
            sunset: '日落',
            vintage: '复古',
            forest: '森林',
            ocean: '海蓝',
            violet: '紫罗兰',
            rainbow: '彩虹'
        },
        
        // 照片相关
        shakeToReveal: '摇一摇显影',
        shakeProgress: '摇一摇显影 {current}/{total}',
        revealComplete: '✨ 显影完成!',
        developHint: '按住拖动/晃动显影',
        developHintEmoji: '👋',
        shakeTip: '晃动手机即可显影',
        mysteryDevelopingTitle: '照片冲洗中',
        mysteryDevelopingDesc: '照片冲洗中，请耐心等待\n预计{hours}小时{minutes}分钟后冲洗完',
        mysteryDevelopingAlt: '照片冲洗中',
        mysteryTapToReveal: '点击揭晓',
        defaultPhotoAlt: 'TimeFrame 拍立得照片',
        mysteryPhotoAlt: 'TimeFrame 盲盒照片',
        mysteryRevealAlt: '已揭晓的盲盒照片',
        shareUnsupported: '当前浏览器不支持系统分享，将为您自动下载图片',
        shareFailed: '分享失败，请稍后重试',
        watermarkText: 'timeframe.cam',
        
        // 操作提示
        footerHint: '点击快门拍照 · 拖拽移动照片 · 双击照片保存',
        footerNote: '当前小破站还存在一些bug，我保证3天3夜不睡觉全部搞定！',
        doubleClickToSave: '双击照片保存',
        dragToMove: '拖拽移动照片',
        clickToShoot: '点击快门拍照',
        
        // 按钮
        close: '关闭',
        delete: '删除',
        share: '分享',
        download: '下载',
        save: '保存',
        cancel: '取消',
        confirm: '确认',
        
        // 右上角按钮
        help: '帮助',
        settings: '设置',
        language: '中文',
        
        // 帮助/QA
        helpTitle: '使用说明 & 常见问题',
        quickTutorial: '📱 快速教程',
        tutorialStep1: '1️⃣ 打开相机 → 拍照',
        tutorialStep2: '2️⃣ 摇一摇 → 等待显影',
        tutorialStep3: '3️⃣ 点击保存 → 下载分享',
        faqTitle: '❓ 常见问题',
        faqQ1: 'Q: 为什么摇不出来?',
        faqA1: 'A: 需要摇至少10次，确保手机有加速度传感器权限',
        faqQ2: 'Q: 照片能保存多久?',
        faqA2: 'A: 照片保存在本地，不会自动删除',
        contactTitle: '📧 联系我们',
        contactWechat: '微信: [你的微信]',
        contactEmail: '邮箱: support@timeframe.photo',
        
        // 设置
        settingsTitle: '设置',
        photoSettings: '📷 拍照设置',
        frameStyle: '相框样式',
        fontStyle: '字体样式',
        fontHandwriting: '手写体',
        fontSerif: '衬线体',
        fontMonospace: '等宽体',
        fontSans: '无衬线',
        paperTexture: '相纸纹理',
        paperEffect: '相纸效果',
        mysteryPhoto: '盲盒照片',
        mysteryTime: '盲盒时间',
        exchangeMystery: '交换盲盒',
        soundPhoto: '留声照片',
        burstMode: '连拍手稿',
        shakeCount: '摇一摇次数',
        comingSoon: '即将上线',
        shutterSound: '快门音效',
        memberCenter: '👤 会员中心',
        currentStatus: '当前状态',
        freeUser: '免费版用户',
        memberUser: '会员用户',
        redeemCode: '兑换会员码',
        viewPrivileges: '查看会员特权',
        themeSettings: '🎨 主题设置',
        darkMode: '深色模式',
        lightMode: '浅色模式',
        aboutTitle: 'ℹ️ 关于本应用',
        helpTitle: '关于时光相框',
        version: '版本',
        upcomingFeatures: '🚀 即将上线功能',
        featureMystery: '✨ 盲盒照片',
        featureSound: '🎙️ 留声照片',
        featureFilters: '🎨 滤镜库',
        featureMysteryTime: '盲盒时间',
        featureMysteryTimeDesc: '自定义盲盒照片的显影时间，让惊喜更可控',
        featureExchangeMystery: '交换盲盒',
        featureExchangeMysteryDesc: '与好友交换盲盒照片，分享神秘时刻',
        featureSoundPhoto: '留声照片',
        featureSoundPhotoDesc: '为照片添加语音留言，让回忆更有声',
        featureBurstMode: '连拍手稿',
        featureBurstModeDesc: '快速连拍多张照片，捕捉精彩瞬间',
        featureShakeCount: '摇一摇次数',
        featureShakeCountDesc: '自定义显影所需的摇动次数，增加趣味性',
        featureRemoveWatermark: '去掉水印',
        featureRemoveWatermarkDesc: '会员专享，下载无水印高清照片',
        featurePhotoSave: '照片保存',
        featurePhotoSaveDesc: '云端同步保存，永不丢失珍贵回忆',
        featureUnlimitedPhotos: '不限拍照次数',
        featureUnlimitedPhotosDesc: '会员专享，无限次拍照，尽情创作',
        featureMoreFrames: '更多相框样式',
        featureMoreFramesDesc: '持续更新更多精美相框，满足不同风格需求',
        aboutModalTitle: '关于',
        wechatName: '马里亚纳ai产品漂流记',
        redbookName: 'AI超级码力',
        contactWeChatAlt: '微信公众号',
        contactRedbookAlt: '小红书',
        privacyPolicy: '隐私政策',
        termsOfService: '使用条款',
        // 拍照次数限制
        photoLimitReached: '今日拍照次数已达上限',
        photoLimitMessage: '免费用户每天可拍照20次，今日已用完。明天再来吧！',
        mysteryLimitReached: '今日盲盒照片次数已达上限',
        mysteryLimitMessage: '免费用户每天可拍1张盲盒照片，今日已用完。明天再来吧！',
        revealLimitReached: '今日摇一摇显影次数已达上限',
        revealLimitMessage: '免费用户每天可摇一摇显影5次，今日已用完。明天再来吧！',
        limitTitle: '拍照次数提醒',
        limitConfirm: '知道了',
        limitNormalTitle: '📸 拍照次数已达上限',
        limitNormalDesc: '您今天的普通照片拍摄次数已达到{limit}次，请明天再来吧！',
        limitMysteryTitle: '🎁 盲盒照片次数已达上限',
        limitMysteryDesc: '您今天的盲盒照片次数已达到{limit}次，请明天再来吧！',
        limitRevealTitle: '🔄 摇一摇显影次数已达上限',
        limitRevealDesc: '您今天的摇一摇显影次数已达到{limit}次，请明天再来吧！',
        limitedFree: '限时免费',
        
        // 相框样式
        frameClassic: '经典白边',
        frameVintage: '复古黄边',
        frameModern: '现代黑边',
        framePastel: '马卡龙粉',
        frameOcean: '海洋蓝',
        frameParty: '派对红',
        frameForest: '森林绿',
        
        // 主题模式
        themeParty: '派对模式',
        themeRetro: '复古模式',
        themeNature: '自然模式',
        themeMinimal: '极简模式',
        themeDreamy: '梦幻模式',
        
        // 照片浏览
        photoGallery: '照片墙',
        gridView: '网格视图',
        cardView: '卡片视图',
        noPhotos: '还没有照片，快去拍一张吧！',
        photoCount: '共 {count} 张照片',
        
        // SEO
        metaDescription: '时光相框(TimeFrame)是一款沉浸式拍立得风格在线相机，支持盲盒照片、摇一摇显影、移动照片墙、滤镜字体与一键下载，帮助你随时捕捉灵感并分享惊喜回忆。',
        ogDescription: '摇一摇就能显影的拍立得小站——记录当下、分享惊喜。',
        schemaDescription: '时光相框(TimeFrame) 提供拍立得风格的在线拍照体验，支持盲盒照片、摇一摇显影、照片墙和移动端分享。'
    },
    en: {
        // Brand
        brand: 'TimeFrame',
        brandEn: 'TimeFrame',
        slogan: 'Shake Your Moments',
        sloganEn: 'Shake Your Moments',
        
        // Camera interface
        captionPlaceholder: 'Write your mood...',
        timeMachine: 'Time Machine',
        autoDevelop: 'Auto Develop',
        manualDevelop: 'Manual Develop',
        
        // Filter names
        filters: {
            original: 'Original',
            blackwhite: 'B&W',
            red: 'Red',
            sunset: 'Sunset',
            vintage: 'Vintage',
            forest: 'Forest',
            ocean: 'Ocean',
            violet: 'Violet',
            rainbow: 'Rainbow'
        },
        
        // Photo related
        shakeToReveal: 'Shake to Reveal',
        shakeProgress: 'Shake to Reveal {current}/{total}',
        revealComplete: '✨ Reveal Complete!',
        developHint: 'Hold & Drag/Shake to Develop',
        developHintEmoji: '👋',
        shakeTip: 'Shake your phone to reveal',
        mysteryDevelopingTitle: 'Developing',
        mysteryDevelopingDesc: 'Photo is developing, please wait\nEstimated {hours}h {minutes}m remaining',
        mysteryDevelopingAlt: 'Photo developing',
        mysteryTapToReveal: 'Tap to reveal',
        defaultPhotoAlt: 'TimeFrame instant photo',
        mysteryPhotoAlt: 'TimeFrame mystery photo',
        mysteryRevealAlt: 'Revealed mystery photo',
        shareUnsupported: 'Sharing is not supported on this browser. Downloading instead.',
        shareFailed: 'Sharing failed. Please try again later.',
        watermarkText: 'timeframe.cam',
        
        // Operation hints
        footerHint: 'Click shutter to shoot · Drag to move · Double-click to save',
        footerNote: 'This tiny site still has a few bugs. I promise to fix them in 3 days!',
        doubleClickToSave: 'Double-click to save',
        dragToMove: 'Drag to move',
        clickToShoot: 'Click shutter to shoot',
        
        // Buttons
        close: 'Close',
        delete: 'Delete',
        share: 'Share',
        download: 'Download',
        save: 'Save',
        cancel: 'Cancel',
        confirm: 'Confirm',
        
        // Top right buttons
        help: 'Help',
        settings: 'Settings',
        language: 'EN',
        
        // Help/QA
        helpTitle: 'Instructions & FAQ',
        quickTutorial: '📱 Quick Tutorial',
        tutorialStep1: '1️⃣ Open camera → Take photo',
        tutorialStep2: '2️⃣ Shake → Wait for develop',
        tutorialStep3: '3️⃣ Click save → Download & share',
        faqTitle: '❓ FAQ',
        faqQ1: 'Q: Why can\'t I shake it?',
        faqA1: 'A: Need to shake at least 10 times, ensure device motion permission',
        faqQ2: 'Q: How long are photos saved?',
        faqA2: 'A: Photos saved locally, won\'t auto-delete',
        contactTitle: '📧 Contact Us',
        contactWechat: 'WeChat: [Your WeChat]',
        contactEmail: 'Email: support@timeframe.photo',
        wechatName: 'Mariana AI Product Journey',
        redbookName: 'AI Super Power',
        contactWeChatAlt: 'WeChat Official Account',
        contactRedbookAlt: 'Xiaohongshu',
        
        // Settings
        settingsTitle: 'Settings',
        photoSettings: '📷 Photo Settings',
        frameStyle: 'Frame Style',
        fontStyle: 'Font Style',
        fontHandwriting: 'Handwriting',
        fontSerif: 'Serif',
        fontMonospace: 'Monospace',
        fontSans: 'Sans-serif',
        paperTexture: 'Paper Texture',
        paperEffect: 'Paper Effect',
        mysteryPhoto: 'Mystery Photo',
        mysteryTime: 'Mystery Time',
        exchangeMystery: 'Exchange Mystery',
        soundPhoto: 'Sound Photo',
        burstMode: 'Burst Mode',
        shakeCount: 'Shake Count',
        comingSoon: 'Coming Soon',
        shutterSound: 'Shutter Sound',
        memberCenter: '👤 Member Center',
        currentStatus: 'Current Status',
        freeUser: 'Free User',
        memberUser: 'Member User',
        redeemCode: 'Redeem Code',
        viewPrivileges: 'View Privileges',
        themeSettings: '🎨 Theme Settings',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        aboutTitle: 'ℹ️ About',
        aboutModalTitle: 'About',
        helpTitle: 'About TimeFrame',
        version: 'Version',
        upcomingFeatures: '🚀 Upcoming Features',
        featureMystery: '✨ Mystery Photos',
        featureSound: '🎙️ Sound Photos',
        featureFilters: '🎨 Filter Library',
        featureMysteryTime: 'Mystery Time',
        featureMysteryTimeDesc: 'Customize the reveal time of mystery photos for more control',
        featureExchangeMystery: 'Exchange Mystery',
        featureExchangeMysteryDesc: 'Exchange mystery photos with friends and share mysterious moments',
        featureSoundPhoto: 'Sound Photo',
        featureSoundPhotoDesc: 'Add voice messages to photos, making memories more vivid',
        featureBurstMode: 'Burst Mode',
        featureBurstModeDesc: 'Take multiple photos quickly to capture exciting moments',
        featureShakeCount: 'Shake Count',
        featureShakeCountDesc: 'Customize the number of shakes needed for development, adding fun',
        featureRemoveWatermark: 'Remove Watermark',
        featureRemoveWatermarkDesc: 'Member exclusive: download high-quality photos without watermark',
        featurePhotoSave: 'Photo Save',
        featurePhotoSaveDesc: 'Cloud sync saves, never lose precious memories',
        featureUnlimitedPhotos: 'Unlimited Photos',
        featureUnlimitedPhotosDesc: 'Member exclusive: unlimited photos, create freely',
        featureMoreFrames: 'More Frame Styles',
        featureMoreFramesDesc: 'Continuously updated with more beautiful frames for different styles',
        privacyPolicy: 'Privacy Policy',
        termsOfService: 'Terms of Service',
        // Photo limit
        footerNote: 'This tiny site still has a few bugs. I promise to fix them in 3 days!',
        photoLimitReached: 'Daily Photo Limit Reached',
        photoLimitMessage: 'Free users can take 20 photos per day. You have reached today\'s limit. Come back tomorrow!',
        mysteryLimitReached: 'Daily Mystery Photo Limit Reached',
        mysteryLimitMessage: 'Free users can take 1 mystery photo per day. You have reached today\'s limit. Come back tomorrow!',
        revealLimitReached: 'Daily Shake to Reveal Limit Reached',
        revealLimitMessage: 'Free users can shake to reveal 5 times per day. You have reached today\'s limit. Come back tomorrow!',
        limitTitle: 'Photo Limit Reminder',
        limitConfirm: 'Got it',
        limitNormalTitle: '📸 Daily photo limit reached',
        limitNormalDesc: 'You have reached the daily limit of {limit} normal photos. Please come back tomorrow!',
        limitMysteryTitle: '🎁 Daily mystery limit reached',
        limitMysteryDesc: 'You have reached the daily limit of {limit} mystery photos. Please come back tomorrow!',
        limitRevealTitle: '🔄 Shake-to-reveal limit reached',
        limitRevealDesc: 'You have reached the daily limit of {limit} shake-to-reveal attempts. Please come back tomorrow!',
        limitedFree: 'Limited-Time Free',
        
        // Frame styles
        frameClassic: 'Classic White',
        frameVintage: 'Vintage Yellow',
        frameModern: 'Modern Black',
        framePastel: 'Pastel Pink',
        frameOcean: 'Ocean Blue',
        frameParty: 'Party Red',
        frameForest: 'Forest Green',
        
        // Theme modes
        themeParty: 'Party Mode',
        themeRetro: 'Retro Mode',
        themeNature: 'Nature Mode',
        themeMinimal: 'Minimal Mode',
        themeDreamy: 'Dreamy Mode',
        
        // Photo gallery
        photoGallery: 'Photo Gallery',
        gridView: 'Grid View',
        cardView: 'Card View',
        noPhotos: 'No photos yet, go take one!',
        photoCount: '{count} photos',
        
        // SEO
        metaDescription: 'TimeFrame is a Polaroid-style web camera with mystery photos, shake-to-reveal, mobile gallery, custom frames, and one-tap downloads to capture and share surprises.',
        ogDescription: 'A Polaroid-style site where you shake to reveal photos—capture the moment and share the surprise.',
        schemaDescription: 'TimeFrame provides a Polaroid-style online photo experience, supporting mystery photos, shake-to-reveal, photo gallery, and mobile sharing.'
    }
};

// 当前语言
let currentLang = localStorage.getItem('timeframe_lang') || 'zh';

// 获取翻译
function t(key, params = {}) {
    const keys = key.split('.');
    let value = i18n[currentLang];
    
    for (const k of keys) {
        value = value?.[k];
    }
    
    if (typeof value !== 'string') {
        console.warn(`Translation missing: ${key} (${currentLang})`);
        return key;
    }
    
    // 替换参数
    if (params && Object.keys(params).length > 0) {
        return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
            return params[paramKey] !== undefined ? params[paramKey] : match;
        });
    }
    
    return value;
}

// 切换语言
function setLanguage(lang) {
    if (i18n[lang]) {
        currentLang = lang;
        localStorage.setItem('timeframe_lang', lang);
        // 触发语言切换事件
        window.dispatchEvent(new CustomEvent('languagechange', { detail: lang }));
        // 重新渲染页面
        updatePageLanguage();
    }
}

// 更新页面语言
function updatePageLanguage() {
    // 更新所有使用翻译的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const params = el.dataset.i18nParams ? JSON.parse(el.dataset.i18nParams) : {};
        el.textContent = t(key, params);
    });
    
    // 更新placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
    
    // 更新常见属性（title/alt/value/aria-label）
    ['title', 'alt', 'value', 'aria-label'].forEach(attribute => {
        document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(el => {
            const key = el.getAttribute(`data-i18n-${attribute}`);
            if (!key) return;
            if (attribute === 'value') {
                el.value = t(key);
            } else {
                el.setAttribute(attribute, t(key));
            }
        });
    });
    
    // 更新title
    document.title = `${t('brand')} - ${t('slogan')}`;
    
    // 更新meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', t('metaDescription'));
    }
    
    // 更新og:description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
        ogDescription.setAttribute('content', t('ogDescription'));
    }
    
    // 更新twitter:description
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
        twitterDescription.setAttribute('content', t('ogDescription'));
    }
    
    // 更新JSON-LD schema description
    const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    if (jsonLdScript) {
        try {
            const jsonLd = JSON.parse(jsonLdScript.textContent);
            jsonLd.description = t('schemaDescription');
            jsonLdScript.textContent = JSON.stringify(jsonLd);
        } catch (e) {
            console.warn('Failed to update JSON-LD description:', e);
        }
    }

    // 联系二维码的昵称仅展示中文，不参与多语言切换
    const qrFixedNames = ['马里亚纳ai产品漂流记', 'AI超级码力'];
    document.querySelectorAll('.qrcode-name').forEach((el, idx) => {
        el.textContent = qrFixedNames[idx] || qrFixedNames[qrFixedNames.length - 1];
    });
}

