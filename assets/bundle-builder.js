(function () {
  const tiers = [
    { min: 4, discount: 20, label: '20% off unlocked' },
    { min: 3, discount: 15, label: '15% off unlocked' },
    { min: 2, discount: 10, label: '10% off unlocked' },
  ];

  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  function getTier(count) {
    return tiers.find((tier) => count >= tier.min) || null;
  }

  function getNextTierMessage(count) {
    if (count < 2) return 'Choose 2 items to unlock 10% off.';
    if (count < 3) return 'Add 1 more item to unlock 15% off.';
    if (count < 4) return 'Add 1 more item to unlock 20% off.';
    return 'Best discount unlocked: 20% off.';
  }

  function initBundleBuilder(root) {
    const tabs = Array.from(root.querySelectorAll('[data-bundle-tab]'));
    const cards = Array.from(root.querySelectorAll('[data-bundle-card]'));
    const selected = new Map();
    const countEl = root.querySelector('[data-bundle-count]');
    const itemsEl = root.querySelector('[data-bundle-items]');
    const tierEl = root.querySelector('[data-bundle-tier]');
    const subtotalEl = root.querySelector('[data-bundle-subtotal]');
    const addButton = root.querySelector('[data-bundle-add]');
    const feedbackEl = root.querySelector('[data-bundle-feedback]');

    function updateSummary() {
      const items = Array.from(selected.values());
      const count = items.length;
      const subtotal = items.reduce((sum, item) => sum + item.price, 0);
      const tier = getTier(count);
      const discount = tier ? Math.round((subtotal * tier.discount) / 100) : 0;
      const estimatedTotal = subtotal - discount;

      if (countEl) {
        countEl.textContent = count === 1 ? '1 item selected' : `${count} items selected`;
      }

      if (itemsEl) {
        itemsEl.innerHTML = '';
        if (items.length === 0) {
          const empty = document.createElement('li');
          empty.className = 'bundle-summary__empty';
          empty.textContent = 'No products selected yet.';
          itemsEl.appendChild(empty);
        } else {
          items.forEach((item) => {
            const li = document.createElement('li');
            li.className = 'bundle-summary__item';
            li.textContent = item.title;
            itemsEl.appendChild(li);
          });
        }
      }

      if (tierEl) {
        tierEl.textContent = tier ? `${tier.label}. Estimated savings ${formatMoney(discount)}.` : getNextTierMessage(count);
      }

      if (subtotalEl) {
        subtotalEl.textContent = formatMoney(estimatedTotal);
      }

      if (addButton) {
        addButton.disabled = count === 0;
      }
    }

    function setFeedback(message, isError) {
      if (!feedbackEl) return;
      feedbackEl.textContent = message || '';
      feedbackEl.style.color = isError ? '#ffb4a8' : '';
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const activeSeries = tab.dataset.bundleTab;

        tabs.forEach((item) => {
          const isActive = item === tab;
          item.classList.toggle('is-active', isActive);
          item.setAttribute('aria-selected', String(isActive));
        });

        cards.forEach((card) => {
          card.classList.toggle('is-hidden', card.dataset.series !== activeSeries);
        });
      });
    });

    cards.forEach((card) => {
      const button = card.querySelector('[data-bundle-toggle]');
      if (!button) return;

      button.addEventListener('click', () => {
        const variantId = card.dataset.variantId;
        if (!variantId) return;

        if (selected.has(variantId)) {
          selected.delete(variantId);
          card.classList.remove('is-selected');
          button.textContent = 'Add to bundle';
          button.setAttribute('aria-pressed', 'false');
          button.setAttribute('aria-label', `Add ${card.dataset.title || 'product'} to bundle`);
        } else {
          selected.set(variantId, {
            id: Number(variantId),
            title: card.dataset.title || 'Selected product',
            price: Number(card.dataset.price) || 0,
          });
          card.classList.add('is-selected');
          button.textContent = 'Remove';
          button.setAttribute('aria-pressed', 'true');
          button.setAttribute('aria-label', `Remove ${card.dataset.title || 'product'} from bundle`);
        }

        setFeedback('');
        updateSummary();
      });
    });

    if (addButton) {
      addButton.addEventListener('click', async () => {
        const items = Array.from(selected.values());
        if (items.length === 0) {
          updateSummary();
          return;
        }

        addButton.disabled = true;
        addButton.textContent = 'Adding...';
        setFeedback('');

        try {
          const bundleId = `bundle-${Date.now()}`;
          const tier = getTier(items.length);
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              items: items.map((item) => ({
                id: item.id,
                quantity: 1,
                properties: {
                  _bundle_builder: 'true',
                  _bundle_id: bundleId,
                  _bundle_discount_tier: tier ? `${tier.discount}%` : 'none',
                },
              })),
            }),
          });

          if (!response.ok) {
            throw new Error('Cart add failed');
          }

          setFeedback('Bundle added to cart.');
          addButton.textContent = 'Added';
          document.dispatchEvent(new CustomEvent('cart:refresh'));
        } catch (error) {
          setFeedback('Could not add this bundle. Please try again.', true);
          addButton.textContent = 'Add bundle to cart';
          addButton.disabled = false;
        }
      });
    }

    updateSummary();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-bundle-builder]').forEach(initBundleBuilder);
  });
})();
