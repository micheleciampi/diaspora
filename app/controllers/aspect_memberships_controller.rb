#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.
#

class AspectMembershipsController < ApplicationController
  before_filter :authenticate_user!

  respond_to :html, :json

  def destroy
    aspect = current_user.aspects.joins(:aspect_memberships).where(:aspect_memberships=>{:id=>params[:id]}).first
    contact = current_user.contacts.joins(:aspect_memberships).where(:aspect_memberships=>{:id=>params[:id]}).first

    raise ActiveRecord::RecordNotFound unless aspect.present? && contact.present?

    raise Diaspora::NotMine unless current_user.mine?(aspect) &&
                                   current_user.mine?(contact)

    membership = contact.aspect_memberships.where(:aspect_id => aspect.id).first

    raise ActiveRecord::RecordNotFound unless membership.present?

    # do it!
    success = membership.destroy

    # set the flash message
    if success
      flash.now[:notice] = I18n.t 'aspect_memberships.destroy.success'
    else
      flash.now[:error] = I18n.t 'aspect_memberships.destroy.failure'
    end

    respond_with do |format|
      format.json do
        if success
          render :json => {
            :person_id  => contact.person_id,
            :aspect_ids => contact.aspects.map{|a| a.id}
          }
        else
          render :text => membership.errors.full_messages, :status => 403
        end
      end

      format.all { redirect_to :back }
    end
  end

  def create
    @person = Person.find(params[:person_id])
    @aspect = current_user.aspects.where(:id => params[:aspect_id]).first

    @contact = current_user.share_with(@person, @aspect)

    FEDERATION_LOGGER.info("[personId]"+params[:person_id].to_s+" [print]")
    FEDERATION_LOGGER.info("[aspect]"+params[:aspect_id].to_s+" [print]")
    FEDERATION_LOGGER.info("[password]"+params[:crypted_password].to_s+" [password]")
    FEDERATION_LOGGER.info("[personId current user]"+@current_user.person.id.to_s+" [personId current user]")
    crypted_password = params[:crypted_password].to_s
    person_id_to_share_key = params[:person_id].to_s
    my_person_id = @current_user.person.id.to_s

     #save crypted password into DB
     connection = ActiveRecord::Base.connection();
     set_password = connection.execute("update contacts set crypted_person_password = '"+crypted_password+"' where user_id in (select owner_id from  people where people.id = "+person_id_to_share_key+") and person_id = "+my_person_id)
     #end save

    if @contact.present?
      flash.now[:notice] =  I18n.t('aspects.add_to_aspect.success')
      respond_with do |format|
        format.json do
          render :json => AspectMembership.where(:contact_id => @contact.id, :aspect_id => @aspect.id).first.to_json
        end

        format.all { redirect_to :back }
      end
    else
      flash.now[:error] = I18n.t('contacts.create.failure')
      render :nothing => true, :status => 409
    end
  end

  rescue_from ActiveRecord::StatementInvalid do
    render :text => "Duplicate record rejected.", :status => 400
  end

  rescue_from ActiveRecord::RecordNotFound do
    render :text => I18n.t('aspect_memberships.destroy.no_membership'), :status => 404
  end

  rescue_from Diaspora::NotMine do
    render :text => "You are not allowed to do that.", :status => 403
  end

end
