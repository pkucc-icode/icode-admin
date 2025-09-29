import { h } from 'vue';
// import { NAvatar, NTag } from 'naive-ui';
import { Tag } from '@/components/Tag';
import { BasicColumn } from '@/components/Table';
export interface ListData {
  id: number;
  name: string;
  sex: string;
  avatar: string;
  email: string;
  city: string;
  status: string;
  type: string;
  createDate: string;
}

const sexMap = {
  male: '男',
  female: '女',
  unknown: '未知',
};

const statusMap = {
  close: '已取消',
  refuse: '已拒绝',
  pass: '已通过',
};

export const columns: BasicColumn<ListData>[] = [
  // {
  //     type: 'selection',
  //     disabled(row: ListData) {
  //       return row.name === 'Edward King 3'
  //     }
  // },
  {
    title: 'id',
    key: 'id',
    resizable: true
  },
  {
    title: '名称',
    key: 'name',
    resizable: true
  },
  // {
  //   title: '头像',
  //   key: 'avatar',
  //   render(record) {
  //     return h(NAvatar, {
  //       size: 50,
  //       src: record.avatar,
  //     });
  //   },
  //   resizable: true
  // },
  {
    title: '性别',
    key: 'sex',
    render(record) {
      return h(
        Tag,
        {
          color: record.sex === 'male' ? '#D6E4F8' : '#F6D1CD',
        },
        {
          default: () => sexMap[record.sex],
        }
      );
    },
    resizable: true
  },
  {
    title: '邮箱',
    key: 'email',
    width: 220,
    resizable: true
  },
  {
    title: '城市',
    key: 'city',
    resizable: true
  },
  {
    title: '状态',
    key: 'status',
    render(record) {
      return h(
        Tag,
        {
          type:
            record.status === 'close'
              ? 'warning'
              : record.status === 'refuse'
              ? 'error'
              : 'success',
        },
        {
          default: () => statusMap[record.status],
        }
      );
    },
    resizable: true
  },
  {
    title: '创建时间',
    key: 'createDate',
    resizable: true,
    sorter: true,
    
  },
];
