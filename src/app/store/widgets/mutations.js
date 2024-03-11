export default {
  setWidgetsList(state, payload) {
    const widgetList = payload.filter((widget) => {
      const foundWidget = state.order.find((widgetOrder) => widgetOrder.widget_id === widget.widget_id);
      if (foundWidget) {
        return false;
      }
      return true;
    });
    state.list = widgetList;
  },
  setWidgetsOrder(state, payload) {
    state.order = payload
  },
  updateWidgetsOrder(state, payload) {
    state.order = payload;
  },
  addWidgetOrder(state, payload) {
    state.order.push(payload);
    const indexWidget = state.list.findIndex((widget) => widget.widget_id === payload.widget_id);
    if (indexWidget !== -1) {
      state.list.splice(indexWidget, 1);
    }
  },
  deleteWidgetOrder(state, payload) {
    const indexFavorite = state.order.findIndex((widget) => widget.widget_id === payload.widget_id);
    if (indexFavorite !== -1) {
      state.order.splice(indexFavorite, 1);
      state.list.push(payload);
    }
  },
  createCopyDnd(state) {
    state.orderDndCopy = state.order.slice();
    state.listDndCopy = state.list.slice();
  },
  cancelChangedDnd(state) {
    state.order = state.orderDndCopy.slice();
    state.list = state.listDndCopy.slice();
  },
};
