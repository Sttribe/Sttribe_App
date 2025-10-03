package com.sttribe

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {

    // Correct Kotlin override for onCreate
    override fun onCreate(savedInstanceState: Bundle?) {
        SplashScreen.show(this)          // no semicolon
        super.onCreate(savedInstanceState)
    }

    // Main component name must match JS entry
    override fun getMainComponentName(): String = "sttribe"

    // Use DefaultReactActivityDelegate
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
