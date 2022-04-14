/* SLIDE UP */
function _slideUp (target, duration = 500) {
  if(!target.classList.contains('_slide')) {
     target.classList.add('_slide');
     target.style.transitionProperty = "height, margin, padding";
     target.style.transitionDuration = duration + "ms";
     target.style.boxSizing = "border-box";
     target.style.height = target.offsetHeight + "px";
     target.offsetHeight;
     target.style.overflow = "hidden";
     target.style.height = 0;
     target.style.paddingTop = 0;
     target.style.paddingBottom = 0;
     target.style.marginTop = 0;
     target.style.marginBottom = 0;
     window.setTimeout(() => {
       target.style.display = "none";
       target.style.removeProperty("height");
       target.style.removeProperty("padding-top");
       target.style.removeProperty("padding-bottom");
       target.style.removeProperty("margin-top");
       target.style.removeProperty("margin-bottom");
       target.style.removeProperty("overflow");
       target.style.removeProperty("transition-duration");
       target.style.removeProperty("transition-property");
       target.classList.remove("_slide");
     }, duration);
  }
}

/* SLIDE DOWN */
function _slideDown (target, duration = 500) {
  if(!target.classList.contains('_slide')) {
     target.classList.add("_slide");
     target.style.removeProperty("display");
     let display = window.getComputedStyle(target).display;
     if (display === "none") display = "block";
     target.style.display = display;
     let height = target.offsetHeight;
     target.style.overflow = "hidden";
     target.style.height = 0;
     target.style.paddingTop = 0;
     target.style.paddingBottom = 0;
     target.style.marginTop = 0;
     target.style.marginBottom = 0;
     target.offsetHeight;
     target.style.boxSizing = "border-box";
     target.style.transitionProperty = "height, margin, padding";
     target.style.transitionDuration = duration + "ms";
     target.style.height = height + "px";
     target.style.removeProperty("padding-top");
     target.style.removeProperty("padding-bottom");
     target.style.removeProperty("margin-top");
     target.style.removeProperty("margin-bottom");
     window.setTimeout(() => {
       target.style.removeProperty("height");
       target.style.removeProperty("overflow");
       target.style.removeProperty("transition-duration");
       target.style.removeProperty("transition-property");
       target.classList.remove("_slide");
     }, duration);
  }
}

/* TOOGLE */
function _slideToggle (target, duration = 500) {
  if (window.getComputedStyle(target).display === "none") {
    return _slideDown(target, duration);
  } else {
    return _slideUp(target, duration);
  }
}

// Анимация появления
function _fadeIn(el, display='block') {
  var opacity = 0.1;

  el.style.opacity = opacity;
  el.style.display = `${display}`;

  var timer = setInterval(function () {
    if (opacity >= 1) {
      clearInterval(timer);
    }

    el.style.opacity = opacity;

    opacity += opacity * 0.1;
  }, 15);
}

function _addClass(array, className) {
	array.forEach(item => item.classList.add(className));
}

function _removeClass(array, className) {
	array.forEach(item => item.classList.remove(className));
}

// Деление на разряды
function thousandSeparator(str) {
    var parts = (str + '').split('.'),
        main = parts[0],
        len = main.length,
        output = '',
        i = len - 1;
    
    while(i >= 0) {
        output = main.charAt(i) + output;
        if ((len - i) % 3 === 0 && i > 0) {
            output = ' ' + output;
        }
        --i;
    }

    if (parts.length > 1) {
        output += '.' + parts[1];
    }
    return output;
}

function isWebp () {
  function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }

  testWebP(function (support) {
    if (support == true) {
    document.querySelector('body').classList.add('webp');
    }else{
    document.querySelector('body').classList.add('no-webp');
    }
  });
}


// Динамический адаптив
class DynamicAdapt {
  constructor(type) {
    this.type = type;
  }

  init() {
    // массив объектов
    this.оbjects = [];
    this.daClassname = '_dynamic_adapt_';
    // массив DOM-элементов
    this.nodes = [...document.querySelectorAll('[data-da]')];

    // наполнение оbjects объктами
    this.nodes.forEach((node) => {
      const data = node.dataset.da.trim();
      const dataArray = data.split(',');
      const оbject = {};
      оbject.element = node;
      оbject.parent = node.parentNode;
      оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
      оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
      оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.оbjects.push(оbject);
    });

    this.arraySort(this.оbjects);

    // массив уникальных медиа-запросов
    this.mediaQueries = this.оbjects
      .map(({
        breakpoint
      }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
      .filter((item, index, self) => self.indexOf(item) === index);

    // навешивание слушателя на медиа-запрос
    // и вызов обработчика при первом запуске
    this.mediaQueries.forEach((media) => {
      const mediaSplit = media.split(',');
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];

      // массив объектов с подходящим брейкпоинтом
      const оbjectsFilter = this.оbjects.filter(
        ({
          breakpoint
        }) => breakpoint === mediaBreakpoint
      );
      matchMedia.addEventListener('change', () => {
        this.mediaHandler(matchMedia, оbjectsFilter);
      });
      this.mediaHandler(matchMedia, оbjectsFilter);
    });
  }

  // Основная функция
  mediaHandler(matchMedia, оbjects) {
    if (matchMedia.matches) {
      оbjects.forEach((оbject) => {
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.moveTo(оbject.place, оbject.element, оbject.destination);
      });
    } else {
      оbjects.forEach(
        ({ parent, element, index }) => {
          if (element.classList.contains(this.daClassname)) {
            this.moveBack(parent, element, index);
          }
        }
      );
    }
  }

  // Функция перемещения
  moveTo(place, element, destination) {
    element.classList.add(this.daClassname);
    if (place === 'last' || place >= destination.children.length) {
      destination.append(element);
      return;
    }
    if (place === 'first') {
      destination.prepend(element);
      return;
    }
    destination.children[place].before(element);
  }

  // Функция возврата
  moveBack(parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== undefined) {
      parent.children[index].before(element);
    } else {
      parent.append(element);
    }
  }

  // Функция получения индекса внутри родителя
  indexInParent(parent, element) {
    return [...parent.children].indexOf(element);
  }

  // Функция сортировки массива по breakpoint и place 
  // по возрастанию для this.type = min
  // по убыванию для this.type = max
  arraySort(arr) {
    if (this.type === 'min') {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === 'first' || b.place === 'last') {
            return -1;
          }
          if (a.place === 'last' || b.place === 'first') {
            return 1;
          }
          return a.place - b.place;
        }
        return a.breakpoint - b.breakpoint;
      });
    } else {
      arr.sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }
          if (a.place === 'first' || b.place === 'last') {
            return 1;
          }
          if (a.place === 'last' || b.place === 'first') {
            return -1;
          }
          return b.place - a.place;
        }
        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  }
}

// Яндекс.Карта
function ymap() {
  let sectionMap = document.querySelector(".map");

  function ymapInit() {
    if (typeof ymaps === "undefined") return;
    let ymap = document.getElementById("ymap");

    ymaps.ready(function () {
      var domodedovo = new ymaps.Map('ymap', {
            center: [55.430393702307846, 37.77547029209066],
            zoom: 11
        }, {
            searchControlProvider: 'yandex#search',
			balloonPanelMaxMapArea: 0
        });
        var objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            clusterize: true,
            // ObjectManager принимает те же опции, что и кластеризатор.
            gridSize: 64,
            clusterDisableClickZoom: false
        });
	
		    // Чтобы задать опции одиночным объектам и кластерам,
		    // обратимся к дочерним коллекциям ObjectManager.
		    objectManager.objects.options.set('preset', 'islands#blueWaterParkCircleIcon');
		    objectManager.clusters.options.set('preset', 'islands#invertedBlueClusterIcons');
		    domodedovo.geoObjects.add(objectManager);
	
			jQuery(function($) {
				$.ajax({
					url: "/data_domodedovo.json"
				}).done(function(data) {
					objectManager.add(data);
				});
			});
    });
  }

  window.addEventListener("scroll", checkYmapInit);
  checkYmapInit();

  function checkYmapInit() {
    let sectionMapTop = sectionMap.getBoundingClientRect().top;
    let scrollTop = window.pageYOffset;
    let sectionMapOffsetTop = sectionMapTop + scrollTop;

    if (scrollTop + window.innerHeight > sectionMapOffsetTop) {
      ymapLoad();
      window.removeEventListener("scroll", checkYmapInit);
    }
  }

  function ymapLoad() {
    let script = document.createElement("script");
    script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
    document.body.appendChild(script);
    script.onload = ymapInit;
  }
}

// Слайдеры
function sliders() {
	if(document.querySelector('.photo')) {
		const photoObj = {
			breakpoint: '1200',
			selector: '.photo__slider',
			slider: null,
			init: false,
			config: {
				loop: true,
				slidesPerView: 3,
				speed: 650,
				spaceBetween: 32,
				pagination: {
			    el: '.photo__pagination',
			    type: 'bullets',
			    clickable: true,
			  },
			  navigation: {
			    nextEl: '.photo__next',
			    prevEl: '.photo__prev',
			  },
			  breakpoints: {
			    // when window width is >= 320px
			    320: {
			      slidesPerView: 1,
			      spaceBetween: 5,
			    },
			    768: {
			    	slidesPerView: 2,
			    	spaceBetween: 10,
			    },
			    992: {
			    	slidesPerView: 3,
			    	spaceBetween: 32,
			    }
			  }
			}
		}

		const photoSlider = new Swiper('.photo__slider', {
			loop: true,
				slidesPerView: 3,
				speed: 650,
				spaceBetween: 32,
				pagination: {
			    el: '.photo__pagination',
			    type: 'bullets',
			    clickable: true,
			  },
			  navigation: {
			    nextEl: '.photo__next',
			    prevEl: '.photo__prev',
			  },
			  breakpoints: {
			    // when window width is >= 320px
			    320: {
			      slidesPerView: 1,
			      spaceBetween: 5,
			    },
			    768: {
			    	slidesPerView: 2,
			    	spaceBetween: 10,
			    },
			    992: {
			    	slidesPerView: 3,
			    	spaceBetween: 32,
			    }
			  }
		});

		// initSlider(photoObj);
		// window.addEventListener('resize', () => initSlider(photoObj));
	}

	if(document.querySelector('.stages')) {
		const stagesObj = {
			breakpoint: '1200',
			selector: '.stages__slider',
			slider: null,
			init: false,
			config: {
				loop: true,
				slidesPerView: 3,
				speed: 650,
				spaceBetween: 32,
				pagination: {
			    el: '.stages__pagination',
			    type: 'bullets',
			    clickable: true,
			  },
			  navigation: {
			    nextEl: '.stages__next',
			    prevEl: '.stages__prev',
			  },
			  breakpoints: {
			    // when window width is >= 320px
			    320: {
			      slidesPerView: 1,
			      spaceBetween: 5,
			    },
			    768: {
			    	slidesPerView: 2,
			    	spaceBetween: 10,
			    },
			    992: {
			    	slidesPerView: 3,
			    	spaceBetween: 32,
			    }
			  }
			}
		}

		initSlider(stagesObj);
		window.addEventListener('resize', () => initSlider(stagesObj));
	}

	if(document.querySelector('.options')) {
		const optionsObj = {
			breakpoint: '1200',
			selector: '.options__slider',
			slider: null,
			init: false,
			config: {
				loop: true,
				slidesPerView: 3,
				speed: 650,
				spaceBetween: 32,
				pagination: {
			    el: '.options__pagination',
			    type: 'bullets',
			    clickable: true,
			  },
			  navigation: {
			    nextEl: '.options__next',
			    prevEl: '.options__prev',
			  },
			  breakpoints: {
			    // when window width is >= 320px
			    320: {
			      slidesPerView: 1,
			      spaceBetween: 5,
			    },
			    768: {
			    	slidesPerView: 2,
			    	spaceBetween: 10,
			    },
			    992: {
			    	slidesPerView: 3,
			    	spaceBetween: 32,
			    },
			  }
			}
		}

		initSlider(optionsObj);
		window.addEventListener('resize', () => initSlider(optionsObj));
	}

	if(document.querySelector('.feedback')) {
		const feedbackSlider = new Swiper('.feedback__slider', {
			slidesPerView: 3, 
			loop: true,
			spaceBetween: 30,
			autoHeight: true,
			speed: 650,
			pagination: {
			  el: '.feedback__pagination',
			  type: 'bullets',
			  clickable: true,
			},
			navigation: {
			  nextEl: '.feedback__next',
			  prevEl: '.feedback__prev',
			},
			breakpoints: {
			    // when window width is >= 320px
			    320: {
			      slidesPerView: 1,
			      spaceBetween: 5,
			    },
			    768: {
			    	slidesPerView: 2,
			    	spaceBetween: 10,
			    },
			    992: {
			    	slidesPerView: 3,
			    	spaceBetween: 15,
			    	autoHeight: true,
			    }
			  }
		});
	}

	// Инициализация слайдера при прохождении breakpoint'а
	function initSlider(obj) {
		const breakpoint = window.matchMedia(`(max-width: ${obj.breakpoint}px)`).matches;

		if (breakpoint && !obj.init) {
      const slider = new Swiper(obj.selector, obj.config);

      obj.init = true;
      obj.slider = slider;
    } else if(!breakpoint && obj.slider) {
      obj.slider.destroy();
      obj.slider = null;
      obj.init = false;
    }
	}
}

// Анимированное появление элементов/текста при нажатии на кнопку
function openContent() {
	const openBtins = document.querySelectorAll('._open-btn');

	if(openBtins) {
		for(let index = 0; index < openBtins.length; index++) {
			const btn = openBtins[index];
			const {mode} = btn.dataset;

			btn.addEventListener('click', () => {
				
				if(mode === 'block') {
					const openedBlock = btn.nextElementSibling;
					const {display} = openedBlock.dataset || 'block';

					_fadeIn(openedBlock, display);
				}	else if(mode === 'text') {
					const parent = btn.closest('._open-parent');

					parent.classList.add('_opened');
				}

				btn.remove();
			});
		}
	}
}

// Кастомный select
function select() {
  const selects = document.querySelectorAll("._select");

  // Show/Hide List with options
  function toggleList(currentSelect, currentContent) {
    if (currentSelect.getAttribute("data-state") === "active")
      closeList(currentSelect, currentContent);
    else openList(currentSelect, currentContent);
  }

  function openList(currentSelect, currentContent) {
    currentSelect.setAttribute("data-state", "active");
    const height = +window
      .getComputedStyle(currentSelect)
      .height.replace("px", "");

    
  }

  function closeList(currentSelect, currentContent) {
    currentSelect.setAttribute("data-state", "");
  }

  if (selects.length) {
    const selectTitles = document.querySelectorAll("._select__title");
    const selectItems = document.querySelectorAll("._select__label");
    const selectBackdrops = document.querySelectorAll("._select__backdrop");
    const selectedInputs = document.querySelectorAll(
      "._select__input[checked]"
    );

    window.addEventListener("DOMContentLoaded", () => {
      for (const input of selectedInputs) {
        const label = input.nextElementSibling;
        const selectElements = getClosest(label);
        const { title } = selectElements;

        title.innerHTML = label.innerHTML;
      }
    });

    for (let index = 0; index < selectTitles.length; index++) {
      const selectTitle = selectTitles[index];

      selectTitle.addEventListener("click", () => {
        const selectElements = getClosest(selectTitle);
        const { select } = selectElements;
        const { content } = selectElements;
        toggleList(select, content);
      });
    }

    for (let index = 0; index < selectItems.length; index++) {
      const item = selectItems[index];

      item.addEventListener("click", () => {
        const selectElements = getClosest(item);
        const { select } = selectElements;
        const { content } = selectElements;
        const { title } = selectElements;

        title.innerHTML = item.innerHTML;
        closeList(select, content);

        if(select.classList.contains('cost__options')) {
        	const 
        		selectInputs = Array.from(select.querySelectorAll('._select__input')),
        		costPlaceholder = document.querySelector('.right-cost__value'),
        		costInput = document.querySelector('.cost__input');

        	item.previousElementSibling.checked = true;

        	calculatePrice(selectInputs, costPlaceholder, +costInput.value);
        }
      });
    }

    for (let index = 0; index < selectBackdrops.length; index++) {
      const backdrop = selectBackdrops[index];

      backdrop.addEventListener("click", () => {
        const selectElements = getClosest(backdrop);
        const { select } = selectElements;
        const { content } = selectElements;
        closeList(select, content);
      });
    }
  }

  function getClosest(item) {
    const select = item.closest("._select");
    return {
      select: select,
      content: select.querySelector("._select__content"),
      title: select.querySelector("._select__title"),
    };
  }
}

// Калькулятор
function calculator() {
	const costBlock = document.querySelector('.cost');

	if(costBlock) {
		const 
			plus = costBlock.querySelector('.cost__plus'),
			minus = costBlock.querySelector('.cost__minus'),
			input = costBlock.querySelector('.cost__input'),
			placeholder = costBlock.querySelector('.right-cost__value'),
			barInner = costBlock.querySelector('.cost__inner'),
			selectInputs = Array.from(costBlock.querySelectorAll('.cost__options ._select__input')),
			rangeInput = costBlock.querySelector('.cost__bar input[type=range]');

			rangeInput.addEventListener('input', () => {
				const value = validateValue(rangeInput.value);
				input.value = value;
				updateBar(barInner, value, input);
				calculatePrice(selectInputs, placeholder, value);
			});

			plus.addEventListener('click', () => {
				const currentValue = +input.value || 0;
				const newValue = validateValue(currentValue + 1);
				input.value = newValue;
				updateBar(barInner, newValue, input);
				rangeInput.value = newValue;
				calculatePrice(selectInputs, placeholder, newValue);
			});

			minus.addEventListener('click', () => {
				const currentValue = +input.value || 0;
				const newValue = validateValue(currentValue - 1);
				input.value = newValue;
				updateBar(barInner, newValue, input);
				rangeInput.value = newValue;
				calculatePrice(selectInputs, placeholder, newValue);
			});

			input.addEventListener('input', () => {
				const value = validateValue(+input.value || 0);
				input.value = value;
				updateBar(barInner, value, input);
				rangeInput.value = value;
				calculatePrice(selectInputs, placeholder, value);
			});
	}

	function validateValue(value) {
		if(value > 250) value = 250;
		else if(value < 0) value = 0;
		return value;
	}

	function updateBar(element, value, input) {
		element.style.width = `${value / input.max * 100}%`;
		return 0;
	}
}

function calculatePrice(array, placeholder, value) {
	const selectedOption = array.find((item) => item.checked);
	const {tarrif} = selectedOption.dataset;
	const result = thousandSeparator(`${value * tarrif}`);

	placeholder.textContent = `${result} ₽`;
}

function header() {
	const burger = document.querySelector('.header__burger');

	if(burger) {
		const menu = document.querySelector('.header__wrapper');

		burger.addEventListener('click', () => {
			burger.classList.toggle('_active');
			menu.classList.toggle('_active');
			document.body.classList.toggle('_lock');
		});
	}

	const subTriggers = Array.from(document.querySelectorAll('._nav-trigger'));
	if(subTriggers) {

		let flag = window.matchMedia("(max-width: 991.98px)").matches;
		initSlide(flag, subTriggers);
		
		window.addEventListener('resize', () => {
			flag = window.matchMedia("(max-width: 991.98px)").matches;

			initSlide(flag, subTriggers);
		});

		function initSlide (flag, items) {
			let activated = items.every(item => item.classList.contains('_nav-trigger_active'));
			if(flag && !activated) {
				for(let index = 0; index < items.length; index++) {
					const item = items[index];

					item.addEventListener('click', start);
				}

				_addClass(items, '_nav-trigger_active');
			} 
			if(!flag && activated) {
				for(let index = 0; index < items.length; index++) {
					const item = items[index];

					_slideDown(item.nextElementSibling);
					item.removeEventListener('click', start);
				}

				_removeClass(items, '_nav-trigger_active');
			}
		}
	}

	function start() {
		_slideToggle(this.nextElementSibling);
	}

}


const da = new DynamicAdapt("max");  
da.init();

openContent();
sliders();
ymap();
select();
calculator();
header();
isWebp();