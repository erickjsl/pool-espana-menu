import type { MenuItem } from '../../data/menu'
import { AppImage } from '../shared/AppImage'

export function ProductRow({ item }: { item: MenuItem }) {
  return (
    <div className="menu-item product-row">
      {item.image ? (
        <div className="product-thumb">
          <AppImage
            src={item.image}
            alt={item.name}
            width={86}
            height={86}
            sizes="(max-width: 640px) 74px, 86px"
          />
        </div>
      ) : null}
      <div className="item-copy">
        <div className="item-title-row">
          <h4>{item.name}</h4>
          {item.badge ? <span className="item-badge">{item.badge}</span> : null}
        </div>
        {item.description ? <p>{item.description}</p> : null}
      </div>
      <strong className="item-price">{item.price}</strong>
    </div>
  )
}
