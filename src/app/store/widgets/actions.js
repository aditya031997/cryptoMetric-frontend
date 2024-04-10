import { apiInstance } from "@/utils/helpers/api-client";

export default {
  getOrderList(context) {
    return apiInstance()?.get('/user/widgets').then(({ widgets }) => {
      context.commit('setWidgetsOrder', widgets);
    });
  },
  getWidgets(context) {
    return apiInstance()?.get('/widgets').then(response => {
      // Logging the entire response object to the console
      console.log(response,"response");
      
      // Assuming your API response structure includes a "widgets" property
      const { widgets } = response;
      
      // Optionally, log just the widgets part if you're specifically interested in it
      console.log(widgets,"widgets");
  
      // Committing the widgets to your Vuex state
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
