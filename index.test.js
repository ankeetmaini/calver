const fs = require("fs");

jest.mock("fs");
jest.mock("@actions/core");
jest.mock("@actions/exec", () => {});
jest.useFakeTimers();
jest.setSystemTime(1643530268736);

const core = require("@actions/core");
const calver = require("./index");



// shows how the runner will run a javascript action with env / stdout protocol
test("updates package json from non calver to calver", () => {
  core.getInput.mockReturnValueOnce("abc");
  core.getInput.mockReturnValueOnce("web");
  fs.readFileSync.mockReturnValueOnce(
    `
{
    "name": "calver",
    "version": "1.0.0",
    "main": "dist/index.js",
    "author": "Ankeet Maini <ankeet.maini@gmail.com>",
    "license": "MIT",
    "scripts": {
        "build": "ncc build index.js --license licenses.txt"
    },
    "dependencies": {
        "@actions/core": "^1.6.0",
        "@vercel/ncc": "^0.33.1"
    },
    "devDependencies": {
        "jest": "^27.4.7"
    }
}
`
  );

  calver();

  expect(fs.writeFileSync).toHaveBeenCalledWith(
    "abc",
    `
{
    "name": "calver",
    "version": "22.01.30.0",
    "main": "dist/index.js",
    "author": "Ankeet Maini <ankeet.maini@gmail.com>",
    "license": "MIT",
    "scripts": {
        "build": "ncc build index.js --license licenses.txt"
    },
    "dependencies": {
        "@actions/core": "^1.6.0",
        "@vercel/ncc": "^0.33.1"
    },
    "devDependencies": {
        "jest": "^27.4.7"
    }
}
`
  );
});

test("updates package json calver", () => {
  core.getInput.mockReturnValueOnce("abc");
  core.getInput.mockReturnValueOnce("web");

  fs.readFileSync.mockReturnValueOnce(
    `
  {
      "name": "calver",
      "version": "22.01.30.2",
      "main": "dist/index.js",
      "author": "Ankeet Maini <ankeet.maini@gmail.com>",
      "license": "MIT",
      "scripts": {
          "build": "ncc build index.js --license licenses.txt"
      },
      "dependencies": {
          "@actions/core": "^1.6.0",
          "@vercel/ncc": "^0.33.1"
      },
      "devDependencies": {
          "jest": "^27.4.7"
      }
  }
  `
  );

  calver();
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    "abc",
    `
  {
      "name": "calver",
      "version": "22.01.30.3",
      "main": "dist/index.js",
      "author": "Ankeet Maini <ankeet.maini@gmail.com>",
      "license": "MIT",
      "scripts": {
          "build": "ncc build index.js --license licenses.txt"
      },
      "dependencies": {
          "@actions/core": "^1.6.0",
          "@vercel/ncc": "^0.33.1"
      },
      "devDependencies": {
          "jest": "^27.4.7"
      }
  }
  `
  );
});

test("updates package json calver - same day large number of deploys", () => {
  core.getInput.mockReturnValueOnce("abc");
  core.getInput.mockReturnValueOnce("web");

  fs.readFileSync.mockReturnValueOnce(
    `
    {
        "name": "calver",
        "version": "22.01.30.2001",
        "main": "dist/index.js",
        "author": "Ankeet Maini <ankeet.maini@gmail.com>",
        "license": "MIT",
        "scripts": {
            "build": "ncc build index.js --license licenses.txt"
        },
        "dependencies": {
            "@actions/core": "^1.6.0",
            "@vercel/ncc": "^0.33.1"
        },
        "devDependencies": {
            "jest": "^27.4.7"
        }
    }
    `
  );

  calver();
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    "abc",
    `
    {
        "name": "calver",
        "version": "22.01.30.2002",
        "main": "dist/index.js",
        "author": "Ankeet Maini <ankeet.maini@gmail.com>",
        "license": "MIT",
        "scripts": {
            "build": "ncc build index.js --license licenses.txt"
        },
        "dependencies": {
            "@actions/core": "^1.6.0",
            "@vercel/ncc": "^0.33.1"
        },
        "devDependencies": {
            "jest": "^27.4.7"
        }
    }
    `
  );
});

test("updates package json calver different dates", () => {
  core.getInput.mockReturnValueOnce("abc");
  core.getInput.mockReturnValueOnce("web");

  fs.readFileSync.mockReturnValueOnce(
    `
    {
        "name": "calver",
        "version": "21.01.30.2",
        "main": "dist/index.js",
        "author": "Ankeet Maini <ankeet.maini@gmail.com>",
        "license": "MIT",
        "scripts": {
            "build": "ncc build index.js --license licenses.txt"
        },
        "dependencies": {
            "@actions/core": "^1.6.0",
            "@vercel/ncc": "^0.33.1"
        },
        "devDependencies": {
            "jest": "^27.4.7"
        }
    }
    `
  );

  calver();
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    "abc",
    `
    {
        "name": "calver",
        "version": "22.01.30.0",
        "main": "dist/index.js",
        "author": "Ankeet Maini <ankeet.maini@gmail.com>",
        "license": "MIT",
        "scripts": {
            "build": "ncc build index.js --license licenses.txt"
        },
        "dependencies": {
            "@actions/core": "^1.6.0",
            "@vercel/ncc": "^0.33.1"
        },
        "devDependencies": {
            "jest": "^27.4.7"
        }
    }
    `
  );
});

test("updates gradle file", () => {
  core.getInput.mockReturnValueOnce("abc");
  core.getInput.mockReturnValueOnce("android");

  fs.readFileSync.mockReturnValueOnce(
    `
    import org.jetbrains.kotlin.config.KotlinCompilerVersion

    plugins {
        id("com.android.application")
        kotlin("android")
        kotlin("android.extensions")
    }
    
    android {
        compileSdkVersion(27)
        defaultConfig {
            applicationId = "org.gradle.kotlin.dsl.samples.androidstudio"
            minSdkVersion(15)
            targetSdkVersion(27)
            versionCode = 1
            versionName = "1.0"
            testInstrumentationRunner = "android.support.test.runner.AndroidJUnitRunner"
        }
        buildTypes {
            getByName("release") {
                isMinifyEnabled = false
                proguardFiles(getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro")
            }
        }
    }
    
    dependencies {
        implementation(fileTree(mapOf("dir" to "libs", "include" to listOf("*.jar"))))
        implementation(kotlin("stdlib-jdk7", KotlinCompilerVersion.VERSION))
        implementation("com.android.support:appcompat-v7:27.1.1")
        implementation("com.android.support.constraint:constraint-layout:1.1.0")
        testImplementation("junit:junit:4.12")
        androidTestImplementation("com.android.support.test:runner:1.0.2")
        androidTestImplementation("com.android.support.test.espresso:espresso-core:3.0.2")
    }
      `
  );

  calver();
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    "abc",
    `
    import org.jetbrains.kotlin.config.KotlinCompilerVersion

    plugins {
        id("com.android.application")
        kotlin("android")
        kotlin("android.extensions")
    }
    
    android {
        compileSdkVersion(27)
        defaultConfig {
            applicationId = "org.gradle.kotlin.dsl.samples.androidstudio"
            minSdkVersion(15)
            targetSdkVersion(27)
            versionCode = 2
            versionName = "22.01.30.0"
            testInstrumentationRunner = "android.support.test.runner.AndroidJUnitRunner"
        }
        buildTypes {
            getByName("release") {
                isMinifyEnabled = false
                proguardFiles(getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro")
            }
        }
    }
    
    dependencies {
        implementation(fileTree(mapOf("dir" to "libs", "include" to listOf("*.jar"))))
        implementation(kotlin("stdlib-jdk7", KotlinCompilerVersion.VERSION))
        implementation("com.android.support:appcompat-v7:27.1.1")
        implementation("com.android.support.constraint:constraint-layout:1.1.0")
        testImplementation("junit:junit:4.12")
        androidTestImplementation("com.android.support.test:runner:1.0.2")
        androidTestImplementation("com.android.support.test.espresso:espresso-core:3.0.2")
    }
      `
  );
});

test("updates gradle file same date", () => {
  core.getInput.mockReturnValueOnce("abc");
  core.getInput.mockReturnValueOnce("android");
  fs.readFileSync.mockReturnValueOnce(
    `
      import org.jetbrains.kotlin.config.KotlinCompilerVersion
  
      plugins {
          id("com.android.application")
          kotlin("android")
          kotlin("android.extensions")
      }
      
      android {
          compileSdkVersion(27)
          defaultConfig {
              applicationId = "org.gradle.kotlin.dsl.samples.androidstudio"
              minSdkVersion(15)
              targetSdkVersion(27)
              versionCode = 456
              versionName = "22.01.30.34"
              testInstrumentationRunner = "android.support.test.runner.AndroidJUnitRunner"
          }
          buildTypes {
              getByName("release") {
                  isMinifyEnabled = false
                  proguardFiles(getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro")
              }
          }
      }
      
      dependencies {
          implementation(fileTree(mapOf("dir" to "libs", "include" to listOf("*.jar"))))
          implementation(kotlin("stdlib-jdk7", KotlinCompilerVersion.VERSION))
          implementation("com.android.support:appcompat-v7:27.1.1")
          implementation("com.android.support.constraint:constraint-layout:1.1.0")
          testImplementation("junit:junit:4.12")
          androidTestImplementation("com.android.support.test:runner:1.0.2")
          androidTestImplementation("com.android.support.test.espresso:espresso-core:3.0.2")
      }
        `
  );

  calver();
  expect(fs.writeFileSync).toHaveBeenCalledWith(
    "abc",
    `
      import org.jetbrains.kotlin.config.KotlinCompilerVersion
  
      plugins {
          id("com.android.application")
          kotlin("android")
          kotlin("android.extensions")
      }
      
      android {
          compileSdkVersion(27)
          defaultConfig {
              applicationId = "org.gradle.kotlin.dsl.samples.androidstudio"
              minSdkVersion(15)
              targetSdkVersion(27)
              versionCode = 457
              versionName = "22.01.30.35"
              testInstrumentationRunner = "android.support.test.runner.AndroidJUnitRunner"
          }
          buildTypes {
              getByName("release") {
                  isMinifyEnabled = false
                  proguardFiles(getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro")
              }
          }
      }
      
      dependencies {
          implementation(fileTree(mapOf("dir" to "libs", "include" to listOf("*.jar"))))
          implementation(kotlin("stdlib-jdk7", KotlinCompilerVersion.VERSION))
          implementation("com.android.support:appcompat-v7:27.1.1")
          implementation("com.android.support.constraint:constraint-layout:1.1.0")
          testImplementation("junit:junit:4.12")
          androidTestImplementation("com.android.support.test:runner:1.0.2")
          androidTestImplementation("com.android.support.test.espresso:espresso-core:3.0.2")
      }
        `
  );
});
