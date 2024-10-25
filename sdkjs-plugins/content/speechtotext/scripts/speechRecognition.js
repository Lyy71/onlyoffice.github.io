/**
 *
 * (c) Copyright Ascensio System SIA 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

// Example insert text into editors (different implementations)
(function (window, undefined) {

  var text = "Hello world!";

  window.Asc.plugin.init = function () {
    this.resizeWindow(392, 147, 392, 147, 392, 147);
    document.getElementById('startBtn').addEventListener('click', function () {
      startRecognition();
      this.disabled = true;
      document.getElementById('stopBtn').disabled = false;
    });

    document.getElementById('stopBtn').addEventListener('click', function () {
      recognition.stop();
      document.getElementById('startBtn').disabled = false;
      this.disabled = true;
    });

    let recognition;
    let finalTranscript = '';
    let ok = true
    let err = ''
    function startRecognition() {
      recognition = new webkitSpeechRecognition();
      recognition.lang = 'zh-CN';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.start();
      recognition.onstart = function () {
        console.log('语音识别开始');
        document.getElementById('result').textContent = 1111;
      };

      recognition.onresult = function (event) {
        const result = event.results[0][0].transcript;
        finalTranscript = result;
        Asc.scope.text = result; // export variable to plugin scope
        this.callCommand(function () {
          var oDocument = Api.GetDocument();
          var oParagraph = Api.CreateParagraph();
          oParagraph.AddText(Asc.scope.text); // or oParagraph.AddText(scope.text);
          oDocument.InsertContent([oParagraph]);
        }, true);
        document.getElementById('result').textContent = result;
      };

      recognition.onerror = function (event) {
        ok = false
        console.error('语音识别错误:', event.error);
        document.getElementById('result').textContent = event.error;
        err = event.error
      };

      recognition.onend = function () {
        const copied = document.getElementById('copied')
        console.log('语音识别结束');
        copied.style.display = 'block';
        if (!ok) {
          copied.innerText = err
          return
        }

        navigator.clipboard.writeText(finalTranscript).then(function () {
          if (finalTranscript == '') {
            copied.innerText = '未收集到语音！请检查麦克风！'
            return
          }
          copied.innerText = '内容已复制！';
          console.log('识别结果已复制到剪贴板');
        }).catch(function (err) {
          copied.innerText = '内容复制失败！';
          console.error('无法复制到剪贴板:', err);
        });
      };

    }
  };

  window.Asc.plugin.button = function (id) {
    this.executeCommand("close", "");
  };

})(window, undefined);