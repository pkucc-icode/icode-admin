import { h } from 'vue';
import { NAvatar } from 'naive-ui';
import { BasicColumn } from '@/components/Table';
import { ImagePreview } from '@/components/ImagePreview';
import { Tag } from '@/components/Tag';

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

// 用于传递头像点击事件的回调
export let onAvatarClick: ((avatar: string) => void) | null = null;

export function setAvatarClickHandler(handler: (avatar: string) => void) {
  onAvatarClick = handler;
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
  {
    title: 'id',
    key: 'id',
  },
  {
    title: '名称',
    key: 'name',
  },
  {
    title: '头像',
    key: 'avatar',
    render(record) {
      return h(
        'div',
        {
          class: 'cursor-pointer hover:opacity-80 transition-opacity',
          onClick: () => {
            if (onAvatarClick) {
              onAvatarClick(record.avatar);
            }
          },
        },
        [
          h(NAvatar, {
            size: 50,
            src: record.avatar,
          }),
        ]
      );
    },
  },
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
  },
  {
    title: '邮箱',
    key: 'email',
    width: 220,
  },
  {
    title: '城市',
    key: 'city',
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
              ? 'default'
              : record.status === 'refuse'
              ? 'error'
              : 'success',
        },
        {
          default: () => statusMap[record.status],
        }
      );
    },
  },
  {
    title: '创建时间',
    key: 'createDate',
  },
];
