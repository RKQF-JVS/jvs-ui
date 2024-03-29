import author from './author.png'
export function drawImage (data) {
  let img = new Image()
  img.src = (data && data.url) || author
  img.onload = () => {
    draw(img, data)
  }
}
function draw (img, data) {
  const canvas = document.getElementById( (data.id ? data.id : 'canvas'))
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  // 获取像素数据
  const imgData = ctx.getImageData(0, 0, img.width, img.height).data
  // 拼接字符
  join(imgData, img)
  consoleDraw('%c郭静%c黎铃果%c王莹%c朱小康%c邹琳雲%c高则喜%c骆高林', [
    'color: #FF3333;font-size: 14px;margin-right: 5px;font-weight: 600;',
    'color: #ee7700;font-size: 14px;margin-right: 5px;font-weight: 600;',
    'color: #daa520;font-size: 14px;margin-right: 5px;font-weight: 600;',
    'color: #228b22;font-size: 14px;margin-right: 5px;font-weight: 600;',
    'color: #66cdaa;font-size: 14px;margin-right: 5px;font-weight: 600;',
    'color: #3471FF;font-size: 14px;margin-right: 5px;font-weight: 600;',
    'color: #BF3EFF;font-size: 14px;margin-right: 5px;font-weight: 600;',
  ])
}
function consoleDraw (str, style) {
  console.log(str, ...style)
}

// 把像素数据拼接成字符
function join (data, img) {
  let gap = 3
  let str = ''
  for (let h = 0; h < img.height; h += gap) {
    str += '\n'
    for (let w = 0; w < img.width; w += gap) {
      str += ' '// 因为字符的高度普遍都比其宽度大，所以额外添加一个空字符平衡一下，否则最终的图形会感觉被拉高了
      let pos = (h * img.width + w) * 4
      let r = data[pos]
      let g = data[pos + 1]
      let b = data[pos + 2]
      // 深色
      if(r == 0 && g == 0 && b == 0) {
        str += '*'
      }else{
        str += ' '
      }
    }
  }
  console.log(str)
}