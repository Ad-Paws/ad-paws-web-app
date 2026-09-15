import { Skeleton } from 'adpaws-ui';

export function CardLoading() {
  return (
    <div style={{ display: 'flex', gap: 12, width: 280 }}>
      <Skeleton style={{ width: 48, height: 48, borderRadius: 9999 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <Skeleton style={{ height: 12, width: '70%' }} />
        <Skeleton style={{ height: 12, width: '40%' }} />
      </div>
    </div>
  );
}

export function ListLoading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 280 }}>
      <Skeleton style={{ height: 16, width: '100%' }} />
      <Skeleton style={{ height: 16, width: '90%' }} />
      <Skeleton style={{ height: 16, width: '95%' }} />
    </div>
  );
}
