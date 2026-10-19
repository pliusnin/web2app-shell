package com.web2appshell

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.zoontek.rnbootsplash.RNBootSplash

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    RNBootSplash.init(this, R.style.BootTheme)
    super.onCreate(savedInstanceState)
  }

  /**
   * Возвращает имя главного компонента, зарегистрированного из JavaScript. По нему планируется
   * рендер компонента.
   */
  override fun getMainComponentName(): String = "web2appShell"

  /**
   * Возвращает экземпляр [ReactActivityDelegate]. Используется [DefaultReactActivityDelegate],
   * который включает New Architecture одним булевым флагом [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
