<template>
  <header class="header">
    <div class="header__search">
      <span class="header__search-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <circle cx="10" cy="10" r="6" />
          <line x1="14" y1="14" x2="20" y2="20" />
        </svg>
      </span>
      <input
        type="search"
        class="header__search-input"
        placeholder="Search transactions, invoices or help"
        autocomplete="off"
      />
    </div>
    <div class="header__actions" role="group" aria-label="Global actions">
      <button class="header__icon-button" type="button" aria-label="Global settings">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="6" />
          <path d="M12 4v4M12 16v4M4 12h4M16 12h4M6.5 6.5l2.8 2.8M15.7 15.7l2.8 2.8M17.3 6.7l-2.8 2.8M6.5 17.5l2.8-2.8" />
        </svg>
      </button>
      <button class="header__icon-button" type="button" aria-label="Chat inbox">
        <svg viewBox="0 0 24 24">
          <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H8l-4 3V6a1 1 0 0 1 1-1z" />
        </svg>
      </button>
      <button class="header__icon-button" type="button" aria-label="Global notifications">
        <svg viewBox="0 0 24 24">
          <path d="M12 3c-2.76 0-5 1.9-5 5v3H5l1 3h12l1-3h-2V8c0-3.1-2.24-5-5-5z" />
          <path d="M9 19h6a3 3 0 0 1-6 0z" />
        </svg>
      </button>
      <button class="header__profile" type="button">
        <div class="header__profile-info">
          <span class="header__profile-name">John Doe</span>
        </div>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
        <div class="header__avatar" aria-hidden="true">JD</div>
      </button>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  @include display-flex;
  @include align-items(center);
  @include justify-content(space-between);
  height: 70px;
  padding: 0 20px;
  background-color: $color-white;
  @include box-shadow(0px 2px 6px 0px rgba(0, 0, 0, 0.1));
  font-family: $SourceSansPro-regular;
  color: $color-text;
}

.header__search {
  @include display-flex;
  @include align-items(center);
}

.header__search-icon {
  svg {
    width: 16px;
    height: 16px;
    stroke: $color-grey-text;
    stroke-width: 1.6;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}

.header__search-input {
  @include flex(1);
  min-width: 250px;
  margin-left: 10px;
  border: none;
  background: transparent;
  font-size: 13px;
  color: $color-text;
  font-family: $SourceSansPro-regular;

  &:focus {
    outline: none;
  }
}

.header__actions {
  @include display-flex;
  @include align-items(center);
  @include gap(12px);
}

.header__icon-button {
  cursor: pointer;
  color: $color-icons;

  svg {
    width: 18px;
    height: 18px;
    stroke: currentColor;
    stroke-width: 1.7;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &:hover {
    border-color: $color-active;
    color: $color-primary;
  }
}

.header__profile {
  @include display-flex;
  @include align-items(center);
  color: $color-primary;
  font-family: $SourceSansPro-regular;
}

.header__avatar {
  @include display-flex;
  @include align-items(center);
  @include justify-content(center);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, $color-blue, $color-active);
  font-size: 13px;
  margin-left: 10px;
  color: $color-white;
}

.header__profile-info {
  @include display-flex;
  @include flex-direction(column);
  font-size: 13px;
  text-align: left;
  margin-right: 15px;

  .header__profile-name {
    color: $color-primary;
  }
}

.header__profile svg {
  width: 16px;
  height: 16px;
  stroke: $color-grey-text;
  stroke-width: 1.7;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
