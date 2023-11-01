import gallery from './gallery'
import backImg from '../../../../styles/chart/info.png'
export default class GInfoCard extends gallery {
  constructor(shape='InfoCard') {
    super(shape);
    this.name='信息卡片'
    this.setting={
      // name: '数据卡片',
      cardTitle: '风控系统',
      cardContent: '最适合自己的电商小程序',
      titleWeight: 10,
      titleSize: 20,
      contentWeight: 5,
      contentSize: 12,
      titleColor: '#fff',
      contentColor: '#fff',
      url: '',
      back: backImg,
      type: 'info', // 展示类型
      infoUrl: '' // 链接地址
    }
    this.dicData = []
    this.showForm = ['name', 'titleWeight', 'titleSize', 'fontSize', 'color', 'back', 'type']
    this.cardTitle = '风控系统'
    this.cardContent = '最适合自己的电商小程序'
  }
}
