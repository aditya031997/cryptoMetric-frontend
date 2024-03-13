export default {
  getOrderList(context) {
    return this._vm.$api.get('/user/widgets').then(({ widgets }) => {
      context.commit('setWidgetsOrder', widgets);
    });
  },
  getWidgets(context) {
    return this._vm.$api.get('/widgets').then(({ widgets }) => {
      context.commit('setWidgetsList', widgets);
    });
  },
  changePositionOrderWidgets(context, data) {
    const list = data.map((widget, index) => ({ widget_id: widget.widget_id, position: index + 1 }));
    return this._vm.$api.post('/widgets/user', { widgets: list }).then(() => {
      context.commit('setWidgetsOrder', data);
    });
  },
};
