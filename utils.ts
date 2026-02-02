
export const triggerHaptic = (style: 'light' | 'medium' | 'heavy' | 'success' = 'light') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    switch (style) {
      case 'light': 
        navigator.vibrate(5); // 极轻微，用于普通点击
        break;
      case 'medium': 
        navigator.vibrate(15); // 稍重，用于切换Tab
        break;
      case 'heavy': 
        navigator.vibrate(30); // 明显，用于点赞
        break;
      case 'success': 
        navigator.vibrate([10, 30, 10]); // 成功反馈模式
        break;
    }
  }
};
