const PRICING = {
  versions: [
    { id: "1", label: "100 km/h", base: 599 },
    { id: "2", label: "150 km/h", base: 799 },
    { id: "3", label: "200 km/h", base: 999 },
    { id: "4", label: "Premium 300 km/h", base: 1500 },
  ],
  colors: [
    { id: "noir", label: "Noir", surcharge: 0 },
    { id: "argent", label: "Argent", surcharge: 0 },
    { id: "rouge", label: "Rouge édition", surcharge: 50 },
  ],
  extras: [
    { id: "garantie", label: "Garantie étendue 2 ans", price: 99 },
    { id: "caméra embarqué", label: "Caméra embarqué Full HD", price: 199 },
  ],
  currency: "EUR",
  locale: "fr-FR",
};

const euroFormatter = new Intl.NumberFormat(PRICING.locale, {
  style: "currency",
  currency: PRICING.currency,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatEuro(eurosNumber) {
  return euroFormatter.format(eurosNumber);
}

function createElement(tagName, attributes = {}, children = []) {
  const element = document.createElement(tagName);

  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "class") {
      element.className = value;
    } else if (key.startsWith("on") && typeof value === "function") {
      element.addEventListener(key.slice(2), value);
    } else if (key === "dataset") {
      Object.assign(element.dataset, value);
    } else if (value !== false && value != null) {
      element.setAttribute(key, value === true ? "" : value);
    }
  });

  children.forEach((child) => element.append(child));
  return element;
}

const priceSectionElement = document.getElementById("price");
const colorOptionsContainer =
  priceSectionElement.querySelector("#colorOptions");
const versionSelectElement =
  priceSectionElement.querySelector("#versionSelect");
const extrasContainer = priceSectionElement.querySelector("#extras");
const totalPriceElement = priceSectionElement.querySelector("#total");
const breakdownElement = priceSectionElement.querySelector("#breakdown");

const defaultColorId = PRICING.colors[0].id;
const defaultVersionId = PRICING.versions[0].id;

const selectedState = {
  colorId: defaultColorId,
  versionId: defaultVersionId,
  selectedExtraIds: new Set(),
};

PRICING.colors.forEach((colorOption) => {
  const isSelected = colorOption.id === selectedState.colorId;

  const colorButtonElement = createElement(
    "button",
    {
      class: "option-btn",
      role: "button",
      "aria-pressed": isSelected ? "true" : "false",
      "data-id": colorOption.id,
      title:
        colorOption.surcharge > 0
          ? `+${formatEuro(colorOption.surcharge)}`
          : "Sans surcoût",
      onclick: () => handleSelectColor(colorOption.id),
    },
    [
      colorOption.label +
        (colorOption.surcharge > 0
          ? ` (+${formatEuro(colorOption.surcharge)})`
          : ""),
    ]
  );

  colorOptionsContainer.appendChild(colorButtonElement);
});

PRICING.versions.forEach((versionOption) => {
  const isDefault = versionOption.id === selectedState.versionId;

  const versionOptionElement = createElement(
    "option",
    {
      value: versionOption.id,
      selected: isDefault,
    },
    [`${versionOption.label} — ${formatEuro(versionOption.base)}`]
  );

  versionSelectElement.appendChild(versionOptionElement);
});

PRICING.extras.forEach((extraOption) => {
  const inputId = `extra-${extraOption.id}`;

  const checkboxRow = createElement("div", { class: "checkbox" }, [
    createElement("input", {
      type: "checkbox",
      id: inputId,
      "data-id": extraOption.id,
      onchange: handleToggleExtra,
    }),
    createElement("label", { for: inputId }, [
      `${extraOption.label} — ${formatEuro(extraOption.price)}`,
    ]),
  ]);

  extrasContainer.appendChild(checkboxRow);
});

function handleSelectColor(colorId) {
  selectedState.colorId = colorId;

  [...colorOptionsContainer.children].forEach((buttonElement) => {
    const thisButtonColorId = buttonElement.getAttribute("data-id");
    buttonElement.setAttribute(
      "aria-pressed",
      thisButtonColorId === colorId ? "true" : "false"
    );
  });

  updatePriceAndBreakdown();
}

versionSelectElement.addEventListener("change", (event) => {
  const newVersionId = event.target.value;
  selectedState.versionId = newVersionId;
  updatePriceAndBreakdown();
});

function handleToggleExtra(event) {
  const extraId = event.target.getAttribute("data-id");
  if (event.target.checked) {
    selectedState.selectedExtraIds.add(extraId);
  } else {
    selectedState.selectedExtraIds.delete(extraId);
  }
  updatePriceAndBreakdown();
}

function computeCurrentTotals() {
  const selectedVersion = PRICING.versions.find(
    (version) => version.id === selectedState.versionId
  );
  const selectedColor = PRICING.colors.find(
    (color) => color.id === selectedState.colorId
  );
  const selectedExtras = PRICING.extras.filter((extra) =>
    selectedState.selectedExtraIds.has(extra.id)
  );

  const basePrice = selectedVersion.base;
  const colorSurcharge = selectedColor.surcharge || 0;
  const extrasTotal = selectedExtras.reduce(
    (sum, extra) => sum + extra.price,
    0
  );

  const totalPrice = basePrice + colorSurcharge + extrasTotal;

  return {
    selectedVersion,
    selectedColor,
    selectedExtras,
    basePrice,
    colorSurcharge,
    extrasTotal,
    totalPrice,
  };
}

function updatePriceAndBreakdown() {
  const {
    selectedVersion,
    selectedColor,
    selectedExtras,
    basePrice,
    colorSurcharge,
    extrasTotal,
    totalPrice,
  } = computeCurrentTotals();

  totalPriceElement.textContent = formatEuro(totalPrice);

  const breakdownLines = [
    `Version (${selectedVersion.label})\t\t${formatEuro(basePrice)}`,
    `Couleur (${selectedColor.label})\t\t${
      colorSurcharge > 0 ? "+" + formatEuro(colorSurcharge) : "+0 €"
    }`,
    selectedExtras.length ? "Options:" : "Options: aucune",
    ...selectedExtras.map(
      (extra) => `  • ${extra.label}\t\t+${formatEuro(extra.price)}`
    ),
    "\n",
    `Sous-total options\t\t${formatEuro(colorSurcharge + extrasTotal)}`,
    `TOTAL\t\t\t${formatEuro(totalPrice)}`,
  ];

  breakdownElement.textContent = breakdownLines.join("\n");
}

updatePriceAndBreakdown();
