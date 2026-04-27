package com.araka

import android.os.Bundle
import android.util.Log
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.zoontek.rnbootsplash.RNBootSplash

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    Log.d("MainActivity", "[NATIVE] onCreate called - initializing BootSplash with BootTheme")
    RNBootSplash.init(this, R.style.BootTheme)
    Log.d("MainActivity", "[NATIVE] BootSplash initialized - native splash should be visible now")
    super.onCreate(savedInstanceState)
    Log.d("MainActivity", "[NATIVE] super.onCreate completed - React Native starting to load")
  }

  override fun onResume() {
    super.onResume()
    Log.d("MainActivity", "[NATIVE] onResume - Activity visible to user")
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Araka"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
