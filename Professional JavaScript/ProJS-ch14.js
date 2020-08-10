/* 第十四章 表单脚本 */

// 14.1 表单基础

// 取得<form>引用
const form1 = document.getElementById('form1');
// document.forms：取得页面的所有表单
const form1copy = document.forms[0];
const from2 = document.forms['from2'];
console.log(form1 === form1copy);

// 14.1.1 提交表单
// 阻止表单提交事件
form1copy.addEventListener('submit', (event) => {
  event.preventDefault();
});
// 调用 submit() 提交，无需表单包含提交按钮，且不会触发 submit 事件
// form1.submit();

// 14.1.2 重置表单
// 阻止重置事件
form1copy.addEventListener('reset', (event) => {
  event.preventDefault();
});
// form1.reset()

// 14.1.3 表单字段(表单中所有控件的集合，不包括图像按钮)，使用name索引时，相同name属性的字段组成一个NodeList
console.log(Array.from(form1copy.elements));

// 1.共有的表单字段属性：除<fieldset>外，所有表单字段拥有相同的一组属性
{
  let field = form1copy.elements[0];
  field.value = 'Another Value';
  console.log(field.form === form1copy);
  field.disabled = true;
  field.type = 'checkbox';
}
// 避免重复提交
form1copy.addEventListener('submit', (event) => {
  let btn = event.target.elements[1];
  btn.disabled = true;
});
// <input>和<button> 的type属性可以动态修改

/*
2. 共有的表单字段方法：focus(), blur()
focus()：移动焦点到该字段，如果字段是<input>，且是被隐藏的，则会导致错误
HTML5新增了 autofocus，设置该属性，自动移动焦点到该字段
blur()：移走焦点
*/

/* 
3. 共有的表单字段事件
除了标准事件外，表单字段还支持下列事件：
1. blur：失去焦点时触发
2. change：对<input>和<textarea>，失去焦点且value值改变时触发；对<select>，选项改变时触发
3. focus：获得焦点时触发
*/
{
  const textbox = document.forms[1].elements[0];
  textbox.addEventListener('focus', (event) => {
    let bkc = event.target.style.backgroundColor;
    if (bkc !== 'red') {
      bkc = 'yellow';
    }
  });
  textbox.addEventListener('blur', (event) => {
    let target = event.target;
    if (/[^\d]/.test(target.value)) {
      target.style.backgroundColor = 'red';
    } else {
      target.style.backgroundColor = '';
    }
  });
  textbox.addEventListener('change', (event) => {
    let target = event.target;
    if (/[^\d]/.test(target.value)) {
      target.style.backgroundColor = 'red';
    } else {
      target.style.backgroundColor = '';
    }
  });
}

// 14.2 文本框脚本
/*
14.2.1 选择文本
0.选择方法：select()：在获得焦点时选择所有文本
1.选择事件：选择了文本框中的文本或调用了select()时触发
2.取得选择的文本：HTML5增加了两个属性：selectionStart和selectionEnd，表示基于0的选择范围
3.取得部分文本：setSelectionRange(start, end)：即文本框获得焦点时选择部分文本，而不是全部文本
*/
{
  const textbox = document.forms[1].elements[1];
  textbox.addEventListener('focus', (event) => {
    event.target.select();
  });
  const textarea = document.forms[1].elements[2];
  const msg = 'you selected: ';
  textbox.addEventListener('select', (event) => {
    textarea.value = `${msg}${event.target.value.substring(
      textbox.selectionStart,
      textbox.selectionEnd
    )}`;
  });
  textarea.addEventListener('focus', (event) => {
    event.target.setSelectionRange(msg.length, textarea.value.length);
  });
}

// 14.2.2 过滤输入
// 1. 屏蔽字符
{
  const textbox = document.forms[1].elements[1];
  textbox.addEventListener('keypress', (event) => {
    let charCode = event.charCode;
    // 屏蔽非数值输入
    if (!/\d/.test(String.fromCharCode(charCode))) {
      event.preventDefault();
    }
  });
}
// 2. 操作剪贴板
{
  const textbox = document.forms[1].elements[1];
  textbox.addEventListener('paste', (event) => {
    let text = event.clipboardData.getData('text');
    if (!/^\d*$/.test(text)) {
      event.preventDefault();
    }
  });
}

// 14.2.3 自动切换焦点
{
  const input = document.forms[2].elements[0];
  const submit = document.forms[2].elements[1];
  input.addEventListener('keypress', (event) => {
    if (!/\d/.test(String.fromCharCode(event.charCode))) {
      event.preventDefault();
    }
  });
  input.addEventListener('keyup', (event) => {
    let target = event.target;
    if (target.value.length >= target.maxLength) {
      submit.focus();
    }
  });
}

/*
14.2.4 HTML5约束验证API
1.必填字段：required
4.输入模式：pattern。不能阻止用户输入
5.检测有效性：checkValidity()。对表单自身调用，如果有一个字段无效，则返回 false
6.禁用验证：novalidate，表单属性，不是字段属性；多个提交按钮，指定某个按钮不验证：formnovalidate
*/
{
  const email = document.forms[3].elements[0];
  if (email.checkValidity()) {
    console.log('yes');
  } else {
    console.log('no');
  }
}

/*
14.3 选择框脚本：<select>，<option>
*/
{
  const select = document.forms[4].elements[0];
  select.addEventListener('change', (event) => {
    console.log(select.multiple);
    console.log(select.selectedIndex);
    console.log(select.size);
    console.log(select.value);
  });
  const option1 = select.options[0];
  console.log(option1.text);
  console.log(option1.index);
  console.log(option1.label);
  console.log(option1.selected);
  console.log(option1.value);

  // 14.3.1 选择选项：selectedIndex：被选择项的索引
  let selectedOption = select.options[select.selectedIndex];
  // 14.3.2 添加选项
  let newOption = new Option('5', 5, false, false);
  // 第二个选项是新选项之后选项的索引，传入 undefined 使新选项追加到最后
  select.add(newOption, undefined);
  // 14.3.3 移除选项
  select.remove(4);
  // 14.3.4 移动和重排选项
  const select2 = document.forms[4].elements[1];
  select2.appendChild(select.options[0]);
  select.insertBefore(select.options[1], select.options[0]);
}

// 14.4 表单序列化
function serialize(form) {
  const parts = [];
  for (let i = 0, len = form.elements.length; i < len; ++i) {
    let field = form.elements[i];
    switch (field.type) {
      case 'select-one':
      case 'select-multiple': {
        if (field.name.length) {
          for (let j = 0, oplen = field.options.length; j < oplen; ++j) {
            let option = field.options[j];
            if (option.selected) {
              let opValue = option.hasAttribute('value') ? option.value : option.text;
              parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(opValue));
            }
          }
        }
        break;
      }
      case 'undefined':
      case 'file':
      case 'submit':
      case 'reset':
      case 'button': {
        break;
      }
      case 'radio':
      case 'checkbox': {
        if (!field.checked) {
          break;
        }
      }
      default: {
        if (field.name.length) {
          parts.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value));
        }
      }
    }
  }
  return parts.join('&');
}
let ret = serialize(document.forms[3]);
console.log(ret);

// 14.5 富文本编辑：在页面中嵌入一个包含空白HTML页面的iframe，通过设置 designMode 属性(默认为off)，这个空白HTML页面可以被编辑，编辑对象就是该页面<body>元素的HTML代码
const richEditIframe = frames['richedit'];
window.addEventListener('load', (event) => {
  richEditIframe.document.designMode = 'on';
});

// 14.5.1 contenteditable 属性，该属性可以用任何元素，设置该属性后元素就可编辑
const richEditDiv = document.querySelector('#richedit-div');
// 也可通过JS设置该属性
richEditDiv.contentEditable = 'true';

/*
14.5.2 操作富文本
1. document.execCommand()：对文档执行预定义的命令。参数为：1.命令名称；2.是否提供用户界面的布尔值；3.执行命令需要的值，如不需要，则为null
2. queryCommandEnable()：检测命令是否可以针对当前文本，或者命令是否已经用于了当前文本
3. queryCommandValue()：取得执行命令时传入的值
*/
richEditIframe.document.execCommand('bold', false, null);
richEditIframe.document.execCommand('formatblock', false, '<h1>');
document.execCommand('bold', false, null);
document.execCommand('formatblock', false, '<h1>');

// 14.5.3 富文本选区：使用iframe的getSelection()方法，可以确定实际选择的文本。该方法为window和document对象的属性，调用该方法返回一个表示当前选择文本的 Selection 对象
{
  richEditIframe.addEventListener('focus', (event) => {
    setTimeout(() => {
      const selection = richEditIframe.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = richEditIframe.document.createElement('span');
        span.style.backgroundColor = 'yellow';
        range.surroundContents(span);
      }
    }, 1000);
  });
}

// 14.5.4 表单与富文本：略
