import gallery from './gallery'
import backImg from '../../../../styles/chart/info.png'
export default class GDataCard extends gallery {
  constructor(shape='DataCard') {
    super(shape);
    this.name='数据卡片'
    this.setting={
      // name: '数据卡片',
      cardTitle: '系统用户数',
      titleWeight: 5,
      titleSize: 15,
      contentWeight: 10,
      contentSize: 24,
      titleColor: '#333',
      contentColor: '#de3a4a',
      back: backImg,
      type: 'data', // 展示类型
    }
    this.dicData = []
    this.showForm = ['name', 'titleWeight', 'titleSize', 'fontSize', 'color', 'back', 'type']
    this.cardTitle = '系统用户数'
    this.cardContent = '110,002,135'
    // this.cardContent = 110002135
  }
}
