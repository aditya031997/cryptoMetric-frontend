import { apiInstance } from "@/utils/helpers/api-client";

export default {
  getOrderList(context) {
    return apiInstance()?.get('/user/widgets').then(({ widgets }) => {
      context.commit('setWidgetsOrder', widgets);
    });
  },
  getWidgets(context) {
    return apiInstance()?.get('/widgets').then(response => {
      const { widgets } = response;

      context.commit('setWidgetsList', widgets);
    }).catch(error => {
      // It's good practice to handle potential errors as well
      console.error('Failed to fetch widgets:', error);
    });
  },

  changePositionOrderWidgets(context, data) {

    const list = data.map((widget, index) => ({ widget_id: widget.widget_id, position: index + 1 }));
    return apiInstance().post('/widgets/user', { widgets: list }).then(() => {
      context.commit('setWidgetsOrder', data);
    });
  },
};
