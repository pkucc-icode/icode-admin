import { defineMock } from '@alova/mock';
import { faker } from '@faker-js/faker';
import { doCustomTimes, resultSuccess } from '../_util';
import dayjs from 'dayjs';
function tableList(pageSize: number) {
  const result: any[] = [];
  doCustomTimes(pageSize, () => {
    result.push({
      id: faker.string.numeric(4),
      name: faker.person.firstName(),
      sex: faker.person.sexType(),
      avatar: `https://picsum.photos/200/200?v=${faker.string.numeric(4)}`,
      email: faker.internet.email({ firstName: 'admin' }),
      city: faker.location.city(),
      status: faker.helpers.arrayElement(['close', 'refuse', 'pass']),
      type: faker.helpers.arrayElement(['person', 'company']),
      // createDate: faker.helpers.arrayElement(dateStrs),
      createDate: dayjs(faker.date.anytime()).format('YYYY-MM-DD HH:mm'),
    });
  });
  return result;
}

export default defineMock({
  // 表格数据列表
  '/api/table/list': ({ query }) => {
    const { page = 1, pageSize = 10, name, sort, sortField } = query;
    let list = tableList(Number(pageSize));
    
    // 处理排序
    if (sort && sortField) {
      list.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        
        if (sort === 'asc') {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else if (sort === 'desc') {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
        return 0;
      });
    }
    
    // 并非真实，只是为了模拟搜索结果
    const count = name ? 30 : 60;
    return resultSuccess({
      page: Number(page),
      pageSize: Number(pageSize),
      pageCount: count,
      itemCount: count * Number(pageSize),
      list,
    });
  },
});
